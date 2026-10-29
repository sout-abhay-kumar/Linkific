
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from .auth import router as auth_router
from .admin import router as admin_router
from .database import Base, engine, get_db
from .models import Book, User
from .schemas import BookInput, BookOut, StatsOut
from .security import (
    allowed_origins,
    get_current_user,
    get_optional_current_user,
    require_csrf,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables that do not exist yet.
    Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title="Papertrail Book Library API",
    version="1.0.0",
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS Configuration
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(allowed_origins()),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "X-CSRF-Token"],
)


# --------------------------------------------------
# Authentication Router
# --------------------------------------------------

app.include_router(auth_router)
app.include_router(admin_router)


# --------------------------------------------------
# Helper Function
# --------------------------------------------------

def book_response(book: Book, user: User | None) -> BookOut:
    result = BookOut.model_validate(book)

    result.is_owner = (
        user is not None
        and book.owner_id == user.id
    )
    result.can_manage = user is not None and (
        user.role == "admin" or book.owner_id == user.id
    )

    return result


# --------------------------------------------------
# Root and Health Endpoints
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Papertrail API is running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }


# --------------------------------------------------
# Get All Books
# --------------------------------------------------

@app.get("/api/books", response_model=list[BookOut])
def list_books(
    search: str = Query(default=""),
    category: str = Query(default="All"),
    availability: str = Query(default="All"),
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user),
):
    statement = select(Book)

    # Search by title.
    if search.strip():
        term = f"%{search.strip()}%"

        statement = statement.where(Book.title.ilike(term))

    # Filter by category.
    if category != "All":
        statement = statement.where(
            Book.category == category
        )

    books = list(
        db.scalars(
            statement.order_by(Book.id.desc())
        ).all()
    )

    # Filter by availability.
    if availability == "Available":
        books = [
            book
            for book in books
            if book.available_copies > 0
        ]

    elif availability == "Borrowed":
        books = [
            book
            for book in books
            if book.borrowed_copies > 0
        ]

    return [
        book_response(book, user)
        for book in books
    ]


# --------------------------------------------------
# Get a Single Book
# --------------------------------------------------

@app.get("/api/books/{book_id}", response_model=BookOut)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_current_user),
):
    book = db.get(Book, book_id)

    if book is None:
        raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

    return book_response(book, user)


# --------------------------------------------------
# Get Library Statistics
# --------------------------------------------------

@app.get("/api/stats", response_model=StatsOut)
def stats(
    db: Session = Depends(get_db),
):
    books = list(
        db.scalars(select(Book)).all()
    )

    total_titles = len(books)

    total_copies = sum(
        book.total_copies
        for book in books
    )

    borrowed = sum(
        book.borrowed_copies
        for book in books
    )

    return {
        "total_titles": total_titles,
        "total_copies": total_copies,
        "available_copies": total_copies - borrowed,
        "borrowed_copies": borrowed,
    }


# --------------------------------------------------
# Get Book Categories
# --------------------------------------------------

@app.get("/api/categories", response_model=list[str])
def categories(
    db: Session = Depends(get_db),
):
    values = db.scalars(
        select(Book.category)
        .distinct()
        .order_by(Book.category)
    ).all()

    defaults = [
        "Fiction",
        "Technology",
        "Personal Growth",
        "History",
        "Science",
        "Biography",
        "General",
    ]

    return sorted(
        set(defaults).union(values)
    )


# --------------------------------------------------
# Create a Book
# --------------------------------------------------

@app.post(
    "/api/books",
    response_model=BookOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_csrf)],
)
def create_book(
    payload: BookInput,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    book = Book(
        **payload.model_dump(),
        owner_id=user.id,
    )

    db.add(book)
    db.commit()
    db.refresh(book)

    return book_response(book, user)


# --------------------------------------------------
# Update a Book
# --------------------------------------------------

@app.put(
    "/api/books/{book_id}",
    response_model=BookOut,
    dependencies=[Depends(require_csrf)],
)
def update_book(
    book_id: int,
    payload: BookInput,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    book = db.get(Book, book_id)

    # Only the owner can update their book.
    if book is None or (
        book.owner_id != user.id
        and user.role != "admin"
    ):
        raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

    # Prevent reducing total copies below borrowed copies.
    if payload.total_copies < book.borrowed_copies:
        raise HTTPException(
            status_code=400,
            detail=(
                "Total copies cannot be less than "
                "the number currently borrowed."
            ),
        )

    for key, value in payload.model_dump().items():
        setattr(book, key, value)

    db.commit()
    db.refresh(book)

    return book_response(book, user)


# --------------------------------------------------
# Delete a Book
# --------------------------------------------------

@app.delete(
    "/api/books/{book_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_csrf)],
)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    book = db.get(Book, book_id)

    # Only the owner can delete their book.
    if book is None or (
        book.owner_id != user.id
        and user.role != "admin"
    ):
        raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

    db.delete(book)
    db.commit()

    return Response(
        status_code=status.HTTP_204_NO_CONTENT
    )


# --------------------------------------------------
# Borrow a Book
# --------------------------------------------------

@app.post(
    "/api/books/{book_id}/borrow",
    response_model=BookOut,
    dependencies=[Depends(require_csrf)],
)
def borrow_book(
    book_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    book = db.get(Book, book_id)

    # Only the owner can manage borrowing in this implementation.
    if book is None or (
        book.owner_id != user.id
        and user.role != "admin"
    ):
        raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

    if book.available_copies < 1:
        raise HTTPException(
            status_code=400,
            detail="No copies are available to borrow.",
        )

    book.borrowed_copies += 1

    db.commit()
    db.refresh(book)

    return book_response(book, user)


# --------------------------------------------------
# Return a Book
# --------------------------------------------------

@app.post(
    "/api/books/{book_id}/return",
    response_model=BookOut,
    dependencies=[Depends(require_csrf)],
)
def return_book(
    book_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    book = db.get(Book, book_id)

    # Only the owner can manage borrowing in this implementation.
    if book is None or (
        book.owner_id != user.id
        and user.role != "admin"
    ):
        raise HTTPException(
            status_code=404,
            detail="Book not found.",
        )

    if book.borrowed_copies < 1:
        raise HTTPException(
            status_code=400,
            detail="No borrowed copies to return.",
        )

    book.borrowed_copies -= 1

    db.commit()
    db.refresh(book)

    return book_response(book, user)
