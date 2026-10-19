from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator


class BookBase(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    author: str = Field(min_length=1, max_length=120)
    category: str = Field(default="General", min_length=1, max_length=80)
    published_year: int | None = Field(default=None, ge=1000, le=2100)
    description: str = Field(default="", max_length=3000)
    total_copies: int = Field(default=1, ge=1, le=10000)


class BookCreate(BookBase):
    pass


class BookUpdate(BookBase):
    pass


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
    created_at: datetime


class StatsOut(BaseModel):
    total_titles: int
    total_copies: int
    available_copies: int
    borrowed_copies: int
