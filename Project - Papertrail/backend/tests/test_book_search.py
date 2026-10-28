from sqlalchemy.orm import Session

from app.models import Book


def add_book(database, title, author, category):
    with Session(database) as db:
        book = Book(
            title=title,
            author=author,
            category=category,
            total_copies=1,
            borrowed_copies=0,
        )
        db.add(book)
        db.commit()
        db.refresh(book)
        return book.id


def test_book_search_matches_title_case_insensitively_and_partially(client, database):
    title_match_id = add_book(database, "Python Programming", "Alex Reader", "Technology")
    add_book(database, "A Guide to Coding", "Python Author", "General")
    add_book(database, "Quiet Reading", "Another Reader", "Python Studies")

    response = client.get("/api/books", params={"search": "pY"})

    assert response.status_code == 200
    assert [book["id"] for book in response.json()] == [title_match_id]


def test_empty_book_search_returns_all_books(client, database):
    first_id = add_book(database, "Python Programming", "Alex Reader", "Technology")
    second_id = add_book(database, "A Guide to Coding", "Python Author", "General")

    response = client.get("/api/books", params={"search": "   "})

    assert response.status_code == 200
    assert {book["id"] for book in response.json()} == {first_id, second_id}
