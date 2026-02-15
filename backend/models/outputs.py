from __future__ import annotations
from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional


class RoleSummary(BaseModel):
    title: str = Field(description="Role title as interpreted from the JD")
    seniority: str = Field(description="Seniority level assessment")
    core_function: str = Field(description="One-sentence description of what this person actually does")
    key_responsibilities: list[str] = Field(description="3-5 core responsibilities")
    success_signals: list[str] = Field(description="What success looks like in this role")
    organizational_context: str = Field(description="Assessment of team/company context from the JD")


class AlignmentScores(BaseModel):
    skill_alignment: int = Field(description="Score 0-4: 0=no overlap, 1=peripheral, 2=partial, 3=strong, 4=exceptional")
    skill_rationale: str = Field(description="Why this score")
    trajectory_fit: int = Field(description="Score 0-3: 0=contradicts direction, 1=neutral, 2=aligned, 3=accelerating")
    trajectory_rationale: str = Field(description="Why this score")
    differentiation_potential: int = Field(description="Score 0-3: 0=nothing distinctive, 1=some, 2=strong, 3=exceptional")
    differentiation_rationale: str = Field(description="Why this score")
    strategic_fit_index: int = Field(description="Sum of all three scores, range 0-10")


class StrengthOrGap(BaseModel):
    area: str = Field(description="The skill, experience, or competency area")
    assessment: str = Field(description="Specific analysis of how this maps to the role")
    evidence: str = Field(description="What in the resume supports this assessment")


class CoreAlignment(BaseModel):
    strengths: list[StrengthOrGap] = Field(description="Where the candidate aligns well")
    gaps: list[StrengthOrGap] = Field(description="Where the candidate has meaningful gaps")


class PositioningStrategy(BaseModel):
    label: str = Field(description="Conservative or Stretch")
    narrative: str = Field(description="The story this positioning tells")
    key_points: list[str] = Field(description="3-5 specific talking points")
    risks: str = Field(description="What could go wrong with this positioning")


class BulletUpgrade(BaseModel):
    original: str = Field(description="The original resume bullet or description")
    upgraded: str = Field(description="The repositioned version for this role")
    rationale: str = Field(description="Why this change helps for this specific role")


class RiskOrTradeoff(BaseModel):
    risk: str = Field(description="The risk or tradeoff")
    severity: str = Field(description="Low, Medium, or High")
    mitigation: str = Field(description="How to address or mitigate this")


class Recommendation(str, Enum):
    APPLY_AGGRESSIVELY = "Apply aggressively"
    APPLY_WITH_REPOSITIONING = "Apply with repositioning"
    STRATEGIC_STRETCH = "Strategic stretch role"
    LOW_ROI = "Low ROI role"


class AnalysisResult(BaseModel):
    role_summary: RoleSummary
    alignment: AlignmentScores
    core_alignment: CoreAlignment
    positioning_strategies: list[PositioningStrategy] = Field(description="Exactly 2: one conservative, one stretch")
    resume_upgrades: list[BulletUpgrade] = Field(description="3-5 specific resume bullet upgrades")
    risks_and_tradeoffs: list[RiskOrTradeoff]
    recommendation: Recommendation
    recommendation_rationale: str = Field(description="2-3 sentence explanation of the recommendation")
    uncertainty_notes: Optional[str] = Field(None, description="What could not be assessed from the provided materials")
