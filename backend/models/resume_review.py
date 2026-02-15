from pydantic import BaseModel, Field
from typing import Optional


class ResumeReviewRequest(BaseModel):
    resume_text: str = Field(..., min_length=50, description="Resume content as plain text")
    target_role: Optional[str] = Field(None, description="Target role or job title the user is pursuing")
    career_stage: Optional[str] = Field(None, description="Career stage (e.g., early career, mid-level, senior, career changer)")
    additional_context: Optional[str] = Field(None, description="Any additional context about goals or priorities")


class ResumeReadBack(BaseModel):
    professional_identity: str = Field(description="What the resume says this person is (e.g., 'a mid-level backend engineer')")
    seniority_signal: str = Field(description="What seniority level the resume signals and why")
    domain_signal: str = Field(description="What industries or domains the resume signals expertise in")
    functional_signal: str = Field(description="What functional role the resume signals (builder, manager, strategist, etc.)")
    trajectory_story: str = Field(description="What career trajectory the resume tells — where this person came from and where they're heading")
    overall_impression: str = Field(description="The 10-second impression a hiring manager would form")


class DistinctivenessItem(BaseModel):
    area: str = Field(description="The specific area or element being assessed")
    assessment: str = Field(description="What makes this stand out or blend in")
    explanation: str = Field(description="Why this matters for the reader's perception")


class DistinctivenessCheck(BaseModel):
    stand_out: list[DistinctivenessItem] = Field(description="Elements that genuinely differentiate this candidate")
    blend_in: list[DistinctivenessItem] = Field(description="Elements that use generic language or blend with the crowd")
    summary: str = Field(description="Overall distinctiveness assessment in 1-2 sentences")


class NarrativeGap(BaseModel):
    gap: str = Field(description="The missing story thread or unexplained element")
    impact: str = Field(description="How this gap affects the reader's perception")
    suggestion: str = Field(description="How to address this gap")


class TradeoffItem(BaseModel):
    element: str = Field(description="The resume element or theme being assessed")
    current_treatment: str = Field(description="How the resume currently treats this — Emphasized, Buried, or Underweight")
    assessment: str = Field(description="Whether this tradeoff makes sense given the candidate's likely goals")


class TradeoffAnalysis(BaseModel):
    tradeoffs: list[TradeoffItem] = Field(description="3-6 tradeoff items")
    overall_balance: str = Field(description="Assessment of whether the resume's emphasis choices align with likely goals")


class WeakBullet(BaseModel):
    original: str = Field(description="The exact text of the weak bullet from the resume")
    problem: str = Field(description="What's wrong with this bullet — why it's weak")
    section: str = Field(description="Which resume section this bullet appears in")


class ResumeReviewResult(BaseModel):
    overall_assessment: str = Field(description="3-5 sentence strategic summary of the resume")
    read_back: ResumeReadBack
    distinctiveness: DistinctivenessCheck
    narrative_gaps: list[NarrativeGap] = Field(description="2-5 narrative gaps")
    tradeoff_analysis: TradeoffAnalysis
    weak_bullets: list[WeakBullet] = Field(description="3-7 weakest bullets that need reworking")
    uncertainty_notes: Optional[str] = Field(None, description="What could not be assessed from the provided resume")


class BulletRewriteRequest(BaseModel):
    plain_text: str = Field(..., min_length=10, description="Plain language description of the work done")
    context: Optional[str] = Field(None, description="Strategic context from the resume analysis")
    target_role: Optional[str] = Field(None, description="Target role to tailor the bullet toward")


class BulletRewriteResult(BaseModel):
    rewritten: str = Field(description="The polished resume bullet")
    rationale: str = Field(description="Why the bullet was written this way")
    alternatives: list[str] = Field(description="1-2 alternative versions")
