import json
from collections.abc import AsyncGenerator

from anthropic import AsyncAnthropic

from backend.config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_TOKENS
from backend.models.resume_review import (
    ResumeReviewRequest,
    ResumeReviewResult,
    BulletRewriteRequest,
    BulletRewriteResult,
)
from backend.prompts.resume_review_prompt import RESUME_REVIEW_PROMPT, BULLET_REWRITE_PROMPT

client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


def _build_review_user_message(request: ResumeReviewRequest) -> str:
    parts = [f"## Resume\n\n{request.resume_text}"]
    if request.target_role:
        parts.append(f"## Target Role\n\n{request.target_role}")
    if request.career_stage:
        parts.append(f"## Career Stage\n\n{request.career_stage}")
    if request.additional_context:
        parts.append(f"## Additional Context\n\n{request.additional_context}")
    return "\n\n".join(parts)


def _build_output_schema() -> dict:
    schema = ResumeReviewResult.model_json_schema()
    return _transform_schema(schema)


def _transform_schema(schema: dict) -> dict:
    """Add additionalProperties: false to all object types and resolve $defs."""
    defs = schema.pop("$defs", {})

    def resolve(s: dict) -> dict:
        if "$ref" in s:
            ref_name = s["$ref"].split("/")[-1]
            return resolve(dict(defs[ref_name]))

        if s.get("type") == "object":
            s["additionalProperties"] = False
            if "properties" in s:
                for key in s["properties"]:
                    s["properties"][key] = resolve(s["properties"][key])

        if s.get("type") == "array" and "items" in s:
            s["items"] = resolve(s["items"])

        # Handle anyOf (used by Optional fields)
        if "anyOf" in s:
            s["anyOf"] = [resolve(opt) for opt in s["anyOf"]]

        return s

    return resolve(schema)


def _build_rewrite_schema() -> dict:
    schema = BulletRewriteResult.model_json_schema()
    return _transform_schema(schema)


async def review_stream(request: ResumeReviewRequest) -> AsyncGenerator[str, None]:
    """Stream resume review results as SSE events."""
    user_message = _build_review_user_message(request)
    output_schema = _build_output_schema()

    accumulated = ""

    async with client.messages.stream(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        system=RESUME_REVIEW_PROMPT,
        messages=[{"role": "user", "content": user_message}],
        extra_body={
            "output_schema": {
                "type": "json_schema",
                "json_schema": {
                    "name": "ResumeReviewResult",
                    "schema": output_schema,
                    "strict": True,
                },
            }
        },
    ) as stream:
        async for event in stream:
            if event.type == "content_block_delta":
                delta_text = getattr(event.delta, "text", "")
                if delta_text:
                    accumulated += delta_text
                    yield f"data: {json.dumps({'type': 'delta', 'text': delta_text})}\n\n"

        # Send the complete result
        try:
            result = ResumeReviewResult.model_validate_json(accumulated)
            yield f"data: {json.dumps({'type': 'complete', 'result': result.model_dump(mode='json')})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': f'Failed to parse result: {str(e)}'})}\n\n"

    yield "data: [DONE]\n\n"


async def rewrite_bullet(request: BulletRewriteRequest) -> BulletRewriteResult:
    """Rewrite a single bullet. Non-streaming (small output, fast)."""
    parts = [f"Rewrite this into a resume bullet:\n\n{request.plain_text}"]
    if request.context:
        parts.append(f"Strategic context from resume analysis:\n{request.context}")
    if request.target_role:
        parts.append(f"Target role: {request.target_role}")
    user_message = "\n\n".join(parts)

    rewrite_schema = _build_rewrite_schema()

    response = await client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        system=BULLET_REWRITE_PROMPT,
        messages=[{"role": "user", "content": user_message}],
        extra_body={
            "output_schema": {
                "type": "json_schema",
                "json_schema": {
                    "name": "BulletRewriteResult",
                    "schema": rewrite_schema,
                    "strict": True,
                },
            }
        },
    )

    text = response.content[0].text
    return BulletRewriteResult.model_validate_json(text)
