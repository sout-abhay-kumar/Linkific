from pydantic import BaseModel, ConfigDict, Field, field_validator


class BookInput(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    author: str = Field(min_length=1, max_length=120)
    category: str = Field(default="General", min_length=1, max_length=80)
    published_year: int | None = Field(default=None, ge=1000, le=2100)
    description: str = Field(default="", max_length=3000)
    total_copies: int = Field(default=1, ge=1, le=10000)

    @field_validator("title", "author", "category")
    @classmethod
    def strip_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be empty.")
        return value


class BookOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    author: str
    category: str
    published_year: int | None
    description: str
    total_copies: int
    borrowed_copies: int
    available_copies: int


class StatsOut(BaseModel):
    total_titles: int
    total_copies: int
    available_copies: int
    borrowed_copies: int
