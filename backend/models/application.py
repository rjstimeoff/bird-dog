from pydantic import BaseModel
from typing import Optional


class ApplicationCreate(BaseModel):
    company: str = ""
    role: str = ""
    stage: str = ""
    contacted: str = ""
    date_applied: str = ""
    notes: str = ""


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    stage: Optional[str] = None
    contacted: Optional[str] = None
    date_applied: Optional[str] = None
    notes: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    company: str
    role: str
    stage: str
    contacted: str
    date_applied: str
    notes: str
    created_at: str
    updated_at: str
