# Dictionary vs Database in Python

In a Book Library application like Papertrail, book records can be stored using either a Python dictionary or a database such as SQLite or PostgreSQL.

The main difference is that a dictionary stores data in the program's memory, while a database stores data persistently so it can be retrieved even after the application restarts.

## 1. Using a Python Dictionary

A dictionary stores data as key-value pairs. We can use a book's ID as the key and its details as the value.

```python
books = {
    1: {
        "title": "Atomic Habits",
        "author": "James Clear",
        "year": 2018
    },
    2: {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "year": 2008
    }
}

# Read all books
print(books)

# Read one book
print(books[1])

# Add a new book
books[3] = {
    "title": "Deep Work",
    "author": "Cal Newport",
    "year": 2016
}

# Update a book
books[1]["year"] = 2019

# Delete a book
del books[2]

print(books)
```

### How It Works

- `books` is the dictionary.
- `1`, `2`, and `3` are keys representing book IDs.
- Each key points to another dictionary containing book details.
- We can create, read, update, and delete records using Python.

**Limitation:** Dictionary data exists in memory and is lost when the Python process stops, unless it is explicitly saved elsewhere.

## 2. Using a Database with SQL

A database stores records in tables. The following example uses SQLite, which is convenient for learning because Python includes the `sqlite3` module.

```python
import sqlite3

# Connect to a database file
connection = sqlite3.connect("papertrail.db")

# Create a cursor to execute SQL
cursor = connection.cursor()

# Create a table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        year INTEGER
    )
""")

# CREATE: Insert a book
cursor.execute(
    "INSERT INTO books (title, author, year) VALUES (?, ?, ?)",
    ("Atomic Habits", "James Clear", 2018)
)

# READ: Retrieve all books
cursor.execute("SELECT * FROM books")
print(cursor.fetchall())

# UPDATE: Change a book's publication year
cursor.execute(
    "UPDATE books SET year = ? WHERE id = ?",
    (2019, 1)
)

# DELETE: Remove a book
cursor.execute("DELETE FROM books WHERE id = ?", (1,))

# Save changes
connection.commit()

# Close the connection
connection.close()
```

### How It Works

- `sqlite3.connect()` opens or creates a database file.
- `CREATE TABLE` defines the structure for storing books.
- `INSERT` adds a record.
- `SELECT` retrieves records.
- `UPDATE` modifies a record.
- `DELETE` removes a record.
- `commit()` saves changes to the database.

The `?` placeholders pass values safely into SQL statements instead of inserting user input directly into SQL strings.

**Note:** This example is intended for learning and assumes a fresh database for the sample insert and update. If run repeatedly, the update and delete may target an unintended record because the example does not explicitly assign an ID to each inserted book.

## 3. Dictionary vs Database

| Feature               | Python Dictionary                          | Database                            |
| --------------------- | ------------------------------------------ | ----------------------------------- |
| Storage               | Application memory                         | Persistent storage                  |
| Data survives restart | No, by default                             | Yes, after committed changes        |
| CRUD operations       | Python statements                          | SQL queries or ORM operations       |
| Search                | Key lookups or iteration                   | SQL queries and indexes             |
| Relationships         | Managed manually                           | Can use primary and foreign keys    |
| Multiple users        | Not designed for shared persistent storage | Supports concurrent database access |
| Best suited for       | Temporary data, caches, simple logic       | Real application records            |

## 4. How This Applies to Papertrail

Your Book Library application can use a dictionary while learning CRUD, but a database is more suitable for persistent book records.

```text
React Frontend
      |
      | HTTP requests
      v
FastAPI Backend
      |
      | SQLAlchemy + database driver
      v
Database
(SQLite or PostgreSQL)
```

### Example: Dictionary-Based FastAPI Endpoint

```python
from fastapi import FastAPI

app = FastAPI()

books = {
    1: {
        "title": "Atomic Habits",
        "author": "James Clear"
    }
}

@app.get("/books")
def get_books():
    return list(books.values())
```

Here, FastAPI reads books from the dictionary. To use a database instead, the endpoint would query the database through a database session.

## 5. Key Takeaways

- A **dictionary** is a Python data structure that stores key-value pairs in memory.
- A **database** is a storage system designed to store and manage data persistently.
- **SQL** is a language used to query relational databases.
- **SQLite** stores data in a local database file.
- **PostgreSQL** is a relational database server suitable for multi-user applications.
- **SQLAlchemy** allows Python applications to interact with databases through Python objects.
- For Papertrail, a database helps preserve book records even after the backend restarts.
