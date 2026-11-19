from pydantic import BaseModel, model_validator


class AuditRequest(BaseModel):
    website: str | None = None

    instagram: str | None = None

    @model_validator(mode="after")
    def check_target_provided(self) -> "AuditRequest":
        if not (self.website or "").strip() and not (
            self.instagram or ""
        ).strip():
            raise ValueError(
                "Informe um website ou um Instagram para auditar.",
            )

        return self
