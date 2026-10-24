
# Why Databases Are Required

**Objective:** Understand why applications need databases, the limitations of storing data in Python variables or dictionaries, and how databases help applications store, retrieve, update, and manage data.

## 1. What Is a Database?

A database is an organized collection of data that can be stored, retrieved, updated, and managed efficiently.

For example, in the Papertrail Book Library application, a database can store:

- Book titles
- Authors
- Publication years
- ISBN numbers
- Categories
- Reading status

Instead of losing book records when the backend stops, the application can store them in a database and retrieve them whenever required.

## 2. What Happens Without a Database?

Consider a simple Python program that stores books in a dictionary.

```python
books = {
    1: {
        "title": "Atomic Habits",
        "author": "James Clear"
    },
    2: {
        "title": "Deep Work",
        "author": "Cal Newport"
    }
}

print(books)
```

### Limitations

1. **Temporary storage:** Data exists in the program's memory and is lost when the process stops, unless saved separately.
2. **Limited sharing:** A normal dictionary does not provide a shared, persistent data store for multiple users.
3. **Manual management:** Searching, validating, and organizing complex data can become difficult as the application grows.
4. **Relationships:** Connecting books with users, reviews, and categories requires additional manual logic.
5. **Concurrency:** Managing simultaneous changes safely becomes difficult without appropriate synchronization.

Dictionaries are still useful for temporary data, caching, and learning basic CRUD operations.

## 3. Storing Data Using a Database

We can use SQLite to demonstrate persistent storage. SQLite is included with Python, so no additional database driver is required for this example.

```python
import sqlite3

# Connect to a database file
connection = sqlite3.connect("papertrail.db")
cursor = connection.cursor()

# Create a table
cursor.execute("""
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL
    )
""")

# Insert a book
cursor.execute("""
    INSERT INTO books (title, author)
    VALUES (?, ?)
""", ("Atomic Habits", "James Clear"))

# Save changes
connection.commit()

# Retrieve all books
cursor.execute("SELECT * FROM books")
books = cursor.fetchall()

for book in books:
    print(book)

connection.close()
```

### Expected Output

```text
(1, 'Atomic Habits', 'James Clear')
```

The example assumes a new database or an empty `books` table. Running it repeatedly inserts additional copies of the book.

### How It Works

- `sqlite3.connect()` opens or creates a database file.
- `CREATE TABLE` defines the structure for storing books.
- `INSERT INTO` adds a new book record.
- `SELECT` retrieves stored records.
- `commit()` saves changes.
- `close()` closes the connection.

Unlike a normal dictionary, the data stored in `papertrail.db` remains available after the program exits.

## 4. Main Reasons Databases Are Required

### A. Persistent Storage

Databases save data beyond the lifetime of a running program.

**Example:** Books added to Papertrail remain available after restarting the FastAPI backend.

### B. Efficient Data Retrieval

SQL lets applications retrieve specific records using conditions.

```sql
SELECT * FROM books
WHERE author = 'James Clear';
```

This query retrieves books written by James Clear.

### C. Data Updating and Deletion

Databases support reliable operations for changing or removing records.

```sql
UPDATE books
SET title = 'Atomic Habits - Updated'
WHERE id = 1;
```

```sql
DELETE FROM books
WHERE id = 1;
```

Always use an appropriate `WHERE` condition when targeting specific records.

### D. Data Organization and Relationships

Databases organize data into tables and can connect related records through primary and foreign keys.

For example:

- `books` stores book details.
- `users` stores user details.
- `reviews` stores user reviews and references the relevant book and user.

### E. Multi-User Access

A database system can support multiple users and application requests accessing shared data. It provides transaction and concurrency mechanisms to help maintain data consistency.

### F. Data Integrity and Security

Databases can enforce constraints such as:

- `PRIMARY KEY`: Uniquely identifies each record.
- `NOT NULL`: Prevents a column from containing `NULL`.
- `UNIQUE`: Prevents duplicate values in a column or column combination.
- `FOREIGN KEY`: Enforces relationships between tables.

Database permissions can also restrict which users can access or modify data.

## 5. Dictionary vs Database

| Feature | Python Dictionary | Database |
|---|---|---|
| Storage | Application memory | Persistent storage |
| Survives program restart | No, by default | Yes, after committed changes |
| Data retrieval | Python lookups and iteration | SQL queries |
| Relationships | Managed manually | Supports keys and relationships |
| Multiple users | Requires additional coordination | Supports concurrent access |
| Data integrity | Mostly application-managed | Can enforce constraints |
| Best use | Temporary data and simple operations | Persistent application data |

## 6. Why Papertrail Needs a Database

Papertrail is a Book Library application built with React and FastAPI. A database allows it to store and manage book records persistently.

```text
React Frontend
      |
      | HTTP Requests
      v
FastAPI Backend
      |
      | SQLAlchemy ORM
      v
Database Driver
      |
      v
Database
(SQLite or PostgreSQL)
```

### Workflow

1. A user adds a book through the React interface.
2. React sends a request to FastAPI.
3. FastAPI validates the incoming data.
4. SQLAlchemy performs the database operation through the configured database driver.
5. The database stores the record.
6. FastAPI returns a response to React.
7. The frontend displays the updated book list.

### Technology Responsibilities

- **React:** Displays the interface and collects user input.
- **FastAPI:** Handles HTTP requests and application logic.
- **SQLAlchemy:** Helps Python code interact with database tables through ORM models.
- **Psycopg:** Connects Python applications to PostgreSQL.
- **PostgreSQL:** Stores records persistently and manages database operations.

SQLite can also be used for local development or smaller applications. The appropriate choice depends on the project's requirements.

## 7. Practice Questions

1. Why is a Python dictionary insufficient as the only storage mechanism for a persistent Book Library?
2. What happens to dictionary data when the Python process stops?
3. What is the difference between `INSERT`, `SELECT`, `UPDATE`, and `DELETE`?
4. Why do databases use primary keys and foreign keys?
5. How does FastAPI communicate with a database?
6. What is the role of SQLAlchemy in Papertrail?
7. What is the difference between SQLite and PostgreSQL?

## 8. Key Takeaways

- A database stores and manages data persistently.
- Databases allow applications to retrieve, update, and delete records using structured operations.
- Tables, keys, and constraints help organize and protect data.
- Database systems provide mechanisms for transactions and concurrent access.
- SQLAlchemy simplifies database interactions from Python.
- Papertrail uses a database so its book records can persist beyond a backend restart.

**Conclusion:** Databases are essential when an application needs reliable, organized, persistent, and shareable data. They help transform a simple program into an application that can manage real-world information.
