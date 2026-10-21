from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    author: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(80), nullable=False, default="General", index=True)
    published_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    total_copies: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    borrowed_copies: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    @property
    def available_copies(self):
        return self.total_copies - self.borrowed_copies
