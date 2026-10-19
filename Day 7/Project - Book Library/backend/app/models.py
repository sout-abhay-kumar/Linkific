from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func
from .database import Base


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(180), nullable=False, index=True)
    author = Column(String(120), nullable=False, index=True)
    category = Column(String(80), nullable=False, default="General")
    published_year = Column(Integer, nullable=True)
    description = Column(Text, nullable=False, default="")
    total_copies = Column(Integer, nullable=False, default=1)
    borrowed_copies = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    @property
    def available_copies(self):
        return self.total_copies - self.borrowed_copies
