from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.models.resume_review import ResumeReviewRequest, BulletRewriteRequest
from backend.services.resume_reviewer import review_stream, rewrite_bullet

router = APIRouter(prefix="/resume", tags=["resume-review"])


@router.post("/review")
async def review_resume(request: ResumeReviewRequest):
    return StreamingResponse(
        review_stream(request),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/rewrite-bullet")
async def rewrite_resume_bullet(request: BulletRewriteRequest):
    result = await rewrite_bullet(request)
    return result
