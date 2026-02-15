from pydantic import BaseModel, Field
from typing import Optional


class AnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=50, description="Resume content as plain text")
    job_description: str = Field(..., min_length=50, description="Full job description text")
    ideal_role: Optional[str] = Field(None, description="Description of the candidate's ideal role")
    career_goals: Optional[str] = Field(None, description="Career goals and aspirations")
    portfolio_summary: Optional[str] = Field(None, description="Portfolio or LinkedIn profile summary")
    additional_context: Optional[str] = Field(None, description="Any additional context the candidate wants to share")
