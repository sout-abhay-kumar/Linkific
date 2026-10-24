
# Task: Read and Update Data in Python

**Objective:** Learn how to retrieve existing data and modify it using a Python dictionary and a database.

## 1. Read and Update Data Using a Dictionary

```python
books = {
    1: {"title": "Atomic Habits", "author": "James Clear"},
    2: {"title": "Clean Code", "author": "Robert C. Martin"}
}

# READ: Display all books
print("All books:")
for book_id, book in books.items():
    print(book_id, book)

# READ: Find a specific book
book_id = 1

if book_id in books:
    print("Selected book:", books[book_id])
else:
    print("Book not found")

# UPDATE: Change the title of a book
if book_id in books:
    books[book_id]["title"] = "Atomic Habits - Updated"
    print("Book updated successfully")

# Display updated data
print("Updated book:", books[book_id])
```

### Expected Output

```text
All books:
1 {'title': 'Atomic Habits', 'author': 'James Clear'}
2 {'title': 'Clean Code', 'author': 'Robert C. Martin'}
Selected book: {'title': 'Atomic Habits', 'author': 'James Clear'}
Book updated successfully
Updated book: {'title': 'Atomic Habits - Updated', 'author': 'James Clear'}
```

### Explanation

- `books.items()` retrieves each key-value pair.
- `books[book_id]` accesses a specific book.
- `books[book_id]["title"] = ...` updates the title.
- Dictionary changes remain in memory only while the program is running, unless saved separately.

## 2. Read and Update Data Using SQLite

SQLite stores data in a database file, allowing changes to persist after the program closes.

```python
import sqlite3

connection = sqlite3.connect("papertrail.db")
cursor = connection.cursor()

# Create a table if it does not exist
cursor.execute("""
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL
    )
""")

# Insert a sample record if it does not exist
cursor.execute("""
    INSERT OR IGNORE INTO books (id, title, author)
    VALUES (1, 'Atomic Habits', 'James Clear')
""")
connection.commit()

# READ: Retrieve a book
cursor.execute(
    "SELECT id, title, author FROM books WHERE id = ?",
    (1,)
)
book = cursor.fetchone()

if book:
    print("Book before update:", book)
else:
    print("Book not found")

# UPDATE: Modify the book title
cursor.execute(
    "UPDATE books SET title = ? WHERE id = ?",
    ("Atomic Habits - Updated", 1)
)
connection.commit()

# READ: Retrieve the updated book
cursor.execute(
    "SELECT id, title, author FROM books WHERE id = ?",
    (1,)
)
updated_book = cursor.fetchone()

if updated_book:
    print("Book after update:", updated_book)

connection.close()
```

### Explanation

- `sqlite3.connect()` opens or creates a database file.
- `CREATE TABLE` defines the table structure.
- `INSERT` adds a record.
- `SELECT` retrieves records.
- `UPDATE` modifies an existing record.
- `WHERE` identifies the record to read or update.
- `commit()` saves database changes.
- `fetchone()` retrieves one result row.
- `close()` closes the database connection.

**Important:** The `WHERE id = ?` condition ensures that the update targets the intended book rather than every record in the table. The `?` placeholder safely passes values into the SQL statement.

## 3. Dictionary vs Database

| Feature | Python Dictionary | Database |
|---|---|---|
| Storage | Application memory | Persistent storage |
| Data survives restart | No, by default | Yes, after committed changes |
| Read data | Dictionary key or iteration | SQL `SELECT` |
| Update data | Assign a new value | SQL `UPDATE` |
| Best suited for | Temporary data and simple logic | Persistent application records |

## 4. Practice Tasks

1. **Dictionary practice:** Read book ID 2 and change its author to `Robert Martin`.
2. **Database practice:** Retrieve all books using `SELECT` and `fetchall()`.
3. **Database update:** Update the title of book ID 1 and verify it using `SELECT`.
4. **Error handling:** Try reading a book ID that does not exist and display `Book not found`.

## 5. Application to Papertrail

In the Papertrail Book Library project, the frontend communicates with the FastAPI backend, which retrieves and updates book records in the database.

```text
React Frontend
      |
      | HTTP Requests
      v
FastAPI Backend
      |
      | SQLAlchemy + Database Driver
      v
Database
(SQLite or PostgreSQL)
```

A dictionary can be useful for learning CRUD operations, but a database is better suited to storing book records persistently.

**Key Takeaway:** Reading means retrieving existing data, while updating means modifying existing data. In Python, dictionaries use assignments and lookups; relational databases use SQL queries or an ORM such as SQLAlchemy.
