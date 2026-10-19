from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_, select, func
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Book
from .schemas import BookCreate, BookOut, BookUpdate, StatsOut


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    # Seed a few starter books only when the table is empty.
    with next(get_db()) as db:
        if db.scalar(select(func.count()).select_from(Book)) == 0:
            db.add_all([
                Book(title="Atomic Habits", author="James Clear", category="Personal Growth",
                     published_year=2018, description="A practical guide to building better habits.",
                     total_copies=4),
                Book(title="Clean Code", author="Robert C. Martin", category="Technology",
                     published_year=2008, description="Principles and practices for writing readable code.",
                     total_copies=3),
                Book(title="The Alchemist", author="Paulo Coelho", category="Fiction",
                     published_year=1988, description="A journey about dreams, purpose, and discovery.",
                     total_copies=2),
            ])
            db.commit()
    yield


app = FastAPI(title="Book Library API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/books", response_model=list[BookOut])
def list_books(
    search: str = Query(default="", max_length=180),
    category: str = Query(default="All"),
    availability: str = Query(default="All"),
    db: Session = Depends(get_db),
):
    stmt = select(Book)
    if search.strip():
        term = f"%{search.strip()}%"
        stmt = stmt.where(or_(Book.title.ilike(term), Book.author.ilike(term), Book.category.ilike(term)))
    if category != "All":
        stmt = stmt.where(Book.category == category)
    if availability == "Available":
        stmt = stmt.where(Book.total_copies > Book.borrowed_copies)
    elif availability == "Borrowed":
        stmt = stmt.where(Book.borrowed_copies > 0)
    return list(db.scalars(stmt.order_by(Book.created_at.desc(), Book.title)).all())


@app.get("/api/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    values = db.scalars(select(Book.category).distinct().order_by(Book.category)).all()
    return list(values)


@app.get("/api/stats", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)):
    books = db.scalars(select(Book)).all()
    return StatsOut(
        total_titles=len(books),
        total_copies=sum(book.total_copies for book in books),
        available_copies=sum(book.available_copies for book in books),
        borrowed_copies=sum(book.borrowed_copies for book in books),
    )


@app.post("/api/books", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookCreate, db: Session = Depends(get_db)):
    book = Book(**payload.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@app.put("/api/books/{book_id}", response_model=BookOut)
def update_book(book_id: int, payload: BookUpdate, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    if payload.total_copies < book.borrowed_copies:
        raise HTTPException(status_code=409, detail=f"At least {book.borrowed_copies} total copies are needed because that many are borrowed.")
    for key, value in payload.model_dump().items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book


@app.delete("/api/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    if book.borrowed_copies:
        raise HTTPException(status_code=409, detail="Return all borrowed copies before deleting this book.")
    db.delete(book)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/books/{book_id}/borrow", response_model=BookOut)
def borrow_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    if book.available_copies < 1:
        raise HTTPException(status_code=409, detail="No copies are currently available.")
    book.borrowed_copies += 1
    db.commit()
    db.refresh(book)
    return book


@app.post("/api/books/{book_id}/return", response_model=BookOut)
def return_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found.")
    if book.borrowed_copies < 1:
        raise HTTPException(status_code=409, detail="There are no borrowed copies to return.")
    book.borrowed_copies -= 1
    db.commit()
    db.refresh(book)
    return book
