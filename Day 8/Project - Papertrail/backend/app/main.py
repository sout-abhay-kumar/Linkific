from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import or_, select, func
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import Book
from .schemas import BookInput, BookOut, StatsOut

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="Papertrail Book Library API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Papertrail API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/books", response_model=list[BookOut])
def list_books(
    search: str = Query(default=""),
    category: str = Query(default="All"),
    availability: str = Query(default="All"),
    db: Session = Depends(get_db),
):
    statement = select(Book)
    if search.strip():
        term = f"%{search.strip()}%"
        statement = statement.where(or_(
            Book.title.ilike(term),
            Book.author.ilike(term),
            Book.category.ilike(term),
        ))
    if category != "All":
        statement = statement.where(Book.category == category)
    books = list(db.scalars(statement.order_by(Book.id.desc())).all())
    if availability == "Available":
        books = [book for book in books if book.available_copies > 0]
    elif availability == "Borrowed":
        books = [book for book in books if book.borrowed_copies > 0]
    return books


@app.get("/api/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    books = list(db.scalars(select(Book)).all())
    total_titles = len(books)
    total_copies = sum(book.total_copies for book in books)
    borrowed = sum(book.borrowed_copies for book in books)
    return {
        "total_titles": total_titles,
        "total_copies": total_copies,
        "available_copies": total_copies - borrowed,
        "borrowed_copies": borrowed,
    }


@app.get("/api/categories", response_model=list[str])
def categories(db: Session = Depends(get_db)):
    values = db.scalars(select(Book.category).distinct().order_by(Book.category)).all()
    defaults = ["Fiction", "Technology", "Personal Growth", "History", "Science", "Biography", "General"]
    return sorted(set(defaults).union(values))


@app.post("/api/books", response_model=BookOut, status_code=status.HTTP_201_CREATED)
def create_book(payload: BookInput, db: Session = Depends(get_db)):
    book = Book(**payload.model_dump())
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


@app.put("/api/books/{book_id}", response_model=BookOut)
def update_book(book_id: int, payload: BookInput, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found.")
    if payload.total_copies < book.borrowed_copies:
        raise HTTPException(status_code=400, detail="Total copies cannot be less than the number currently borrowed.")
    for key, value in payload.model_dump().items():
        setattr(book, key, value)
    db.commit()
    db.refresh(book)
    return book


@app.delete("/api/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found.")
    db.delete(book)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/books/{book_id}/borrow", response_model=BookOut)
def borrow_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found.")
    if book.available_copies < 1:
        raise HTTPException(status_code=400, detail="No copies are available to borrow.")
    book.borrowed_copies += 1
    db.commit()
    db.refresh(book)
    return book


@app.post("/api/books/{book_id}/return", response_model=BookOut)
def return_book(book_id: int, db: Session = Depends(get_db)):
    book = db.get(Book, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found.")
    if book.borrowed_copies < 1:
        raise HTTPException(status_code=400, detail="No borrowed copies to return.")
    book.borrowed_copies -= 1
    db.commit()
    db.refresh(book)
    return book
