from __future__ import annotations

from datetime import datetime

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


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
    is_owner: bool = False
    can_manage: bool = False


class StatsOut(BaseModel):
    total_titles: int
    total_copies: int
    available_copies: int
    borrowed_copies: int


class SignupInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)

    @field_validator("full_name")
    @classmethod
    def clean_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Full name cannot be empty.")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("password")
    @classmethod
    def enforce_password_requirements(cls, value: str) -> str:
        if not any(char.islower() for char in value):
            raise ValueError("Password must include a lowercase letter.")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must include an uppercase letter.")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must include a number.")
        return value


class LoginInput(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: Literal["user", "admin"]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    full_name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None

    @field_validator("full_name")
    @classmethod
    def clean_full_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("Full name cannot be empty.")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str | None) -> str | None:
        return value.strip().lower() if value is not None else None

    @model_validator(mode="after")
    def require_a_change(self) -> ProfileUpdate:
        if not self.model_fields_set:
            raise ValueError("Provide a full name or email to update.")
        return self


class ChangePasswordInput(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=12, max_length=128)

    @field_validator("new_password")
    @classmethod
    def enforce_password_requirements(cls, value: str) -> str:
        if not any(char.islower() for char in value):
            raise ValueError("Password must include a lowercase letter.")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must include an uppercase letter.")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must include a number.")
        return value


class ForgotPasswordInput(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class ResetPasswordInput(BaseModel):
    token: str = Field(min_length=32, max_length=200)
    new_password: str = Field(min_length=12, max_length=128)

    @field_validator("new_password")
    @classmethod
    def enforce_password_requirements(cls, value: str) -> str:
        if not any(char.islower() for char in value):
            raise ValueError("Password must include a lowercase letter.")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must include an uppercase letter.")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must include a number.")
        return value


class PasswordResetResponse(BaseModel):
    message: str
    reset_token: str | None = None
