import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from typing import Optional
import aiosqlite

from backend.database import get_db
from backend.models.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
)

router = APIRouter(prefix="/tracker", tags=["tracker"])

VALID_SORT_COLUMNS = {"company", "role", "stage", "contacted", "date_applied", "notes", "created_at", "updated_at", "id"}


@router.get("/applications", response_model=list[ApplicationResponse])
async def list_applications(
    sort_by: str = Query("created_at", description="Column to sort by"),
    sort_dir: str = Query("desc", description="asc or desc"),
    stage: Optional[str] = Query(None, description="Filter by stage"),
    contacted: Optional[str] = Query(None, description="Filter by contacted status"),
    db: aiosqlite.Connection = Depends(get_db),
):
    if sort_by not in VALID_SORT_COLUMNS:
        sort_by = "created_at"
    if sort_dir.lower() not in ("asc", "desc"):
        sort_dir = "desc"

    query = "SELECT * FROM applications"
    params = []
    conditions = []

    if stage is not None:
        conditions.append("stage = ?")
        params.append(stage)
    if contacted is not None:
        conditions.append("contacted = ?")
        params.append(contacted)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    query += f" ORDER BY {sort_by} {sort_dir.upper()}"

    async with db.execute(query, params) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]


@router.post("/applications", response_model=ApplicationResponse, status_code=201)
async def create_application(
    app: ApplicationCreate,
    db: aiosqlite.Connection = Depends(get_db),
):
    async with db.execute(
        """INSERT INTO applications (company, role, stage, contacted, date_applied, notes)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (app.company, app.role, app.stage, app.contacted, app.date_applied, app.notes),
    ) as cursor:
        app_id = cursor.lastrowid
    await db.commit()

    async with db.execute("SELECT * FROM applications WHERE id = ?", (app_id,)) as cursor:
        row = await cursor.fetchone()
        return dict(row)


@router.patch("/applications/{app_id}", response_model=ApplicationResponse)
async def update_application(
    app_id: int,
    updates: ApplicationUpdate,
    db: aiosqlite.Connection = Depends(get_db),
):
    fields = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    set_clause = ", ".join(f"{k} = ?" for k in fields)
    values = list(fields.values())
    values.append(app_id)

    await db.execute(
        f"UPDATE applications SET {set_clause}, updated_at = datetime('now') WHERE id = ?",
        values,
    )
    await db.commit()

    async with db.execute("SELECT * FROM applications WHERE id = ?", (app_id,)) as cursor:
        row = await cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Application not found")
        return dict(row)


@router.delete("/applications/{app_id}", status_code=204)
async def delete_application(
    app_id: int,
    db: aiosqlite.Connection = Depends(get_db),
):
    async with db.execute("SELECT id FROM applications WHERE id = ?", (app_id,)) as cursor:
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail="Application not found")

    await db.execute("DELETE FROM applications WHERE id = ?", (app_id,))
    await db.commit()


# Map common CSV header variations to our column names
COLUMN_MAP = {
    "company": "company",
    "role": "role",
    "title": "role",
    "job title": "role",
    "position": "role",
    "stage": "stage",
    "status": "stage",
    "contacted employees?": "contacted",
    "contacted employees": "contacted",
    "contacted": "contacted",
    "date applied": "date_applied",
    "date_applied": "date_applied",
    "date": "date_applied",
    "applied": "date_applied",
    "notes": "notes",
    "note": "notes",
    "comments": "notes",
}


@router.post("/import-csv", response_model=list[ApplicationResponse])
async def import_csv(
    file: UploadFile = File(...),
    db: aiosqlite.Connection = Depends(get_db),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    content = await file.read()
    text = content.decode("utf-8-sig")  # handle BOM from Excel
    reader = csv.DictReader(io.StringIO(text))

    # Map headers
    header_map = {}
    for header in reader.fieldnames or []:
        normalized = header.strip().lower()
        if normalized in COLUMN_MAP:
            header_map[header] = COLUMN_MAP[normalized]

    inserted_ids = []
    for row in reader:
        mapped = {
            "company": "",
            "role": "",
            "stage": "",
            "contacted": "",
            "date_applied": "",
            "notes": "",
        }
        for csv_col, db_col in header_map.items():
            val = row.get(csv_col, "").strip()
            mapped[db_col] = val

        async with db.execute(
            """INSERT INTO applications (company, role, stage, contacted, date_applied, notes)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (mapped["company"], mapped["role"], mapped["stage"],
             mapped["contacted"], mapped["date_applied"], mapped["notes"]),
        ) as cursor:
            inserted_ids.append(cursor.lastrowid)

    await db.commit()

    if not inserted_ids:
        return []

    placeholders = ",".join("?" * len(inserted_ids))
    async with db.execute(
        f"SELECT * FROM applications WHERE id IN ({placeholders}) ORDER BY id",
        inserted_ids,
    ) as cursor:
        rows = await cursor.fetchall()
        return [dict(row) for row in rows]
