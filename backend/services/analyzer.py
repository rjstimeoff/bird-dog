import json
from collections.abc import AsyncGenerator

from anthropic import AsyncAnthropic

from backend.config import ANTHROPIC_API_KEY, CLAUDE_MODEL, MAX_TOKENS
from backend.models.inputs import AnalysisRequest
from backend.models.outputs import AnalysisResult
from backend.prompts.system_prompt import SYSTEM_PROMPT

client = AsyncAnthropic(api_key=ANTHROPIC_API_KEY)


def _build_user_message(request: AnalysisRequest) -> str:
    parts = [
        f"## Resume\n\n{request.resume_text}",
        f"## Job Description\n\n{request.job_description}",
    ]
    if request.ideal_role:
        parts.append(f"## Ideal Role Description\n\n{request.ideal_role}")
    if request.career_goals:
        parts.append(f"## Career Goals\n\n{request.career_goals}")
    if request.portfolio_summary:
        parts.append(f"## Portfolio / LinkedIn Summary\n\n{request.portfolio_summary}")
    if request.additional_context:
        parts.append(f"## Additional Context\n\n{request.additional_context}")
    return "\n\n".join(parts)


def _build_output_schema() -> dict:
    schema = AnalysisResult.model_json_schema()
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


async def analyze_stream(request: AnalysisRequest) -> AsyncGenerator[str, None]:
    """Stream analysis results as SSE events."""
    user_message = _build_user_message(request)
    output_schema = _build_output_schema()

    accumulated = ""

    async with client.messages.stream(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
        extra_body={
            "output_schema": {
                "type": "json_schema",
                "json_schema": {
                    "name": "AnalysisResult",
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
            result = AnalysisResult.model_validate_json(accumulated)
            yield f"data: {json.dumps({'type': 'complete', 'result': result.model_dump(mode='json')})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': f'Failed to parse result: {str(e)}'})}\n\n"

    yield "data: [DONE]\n\n"
