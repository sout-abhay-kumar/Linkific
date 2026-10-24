# SQL (Structured Query Language)

**Objective:** Understand SQL, learn how to create tables, insert records, retrieve data, update records, delete records, and use SQL in a backend application.

## 1. What Is SQL?

SQL stands for **Structured Query Language**. It is a language used to communicate with relational database systems such as PostgreSQL, MySQL, and SQLite.

SQL allows us to:

- Create databases and tables.
- Insert data into tables.
- Retrieve data from tables.
- Update existing records.
- Delete records.
- Filter, sort, and group data.
- Define relationships between tables.

### Example

Imagine that Papertrail stores books in a database table.

|  id | title         | author           | year |
| --: | ------------- | ---------------- | ---: |
|   1 | Atomic Habits | James Clear      | 2018 |
|   2 | Deep Work     | Cal Newport      | 2016 |
|   3 | Clean Code    | Robert C. Martin | 2008 |

SQL allows us to retrieve a specific book, add another book, or update an existing record.

```sql
SELECT * FROM books;
```

This query retrieves all rows and columns from the `books` table.

## 2. SQL vs Database vs PostgreSQL

These terms have different meanings.

| Term       | Meaning                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------- |
| SQL        | Language used to query and manage relational data                                           |
| Database   | An organized collection of data                                                             |
| PostgreSQL | A relational database management system that supports SQL                                   |
| SQLite     | A relational database engine that stores data in a local file                               |
| SQLAlchemy | A Python library that lets applications interact with databases using Python objects or SQL |
| Psycopg    | A Python driver used to connect to PostgreSQL                                               |

**Remember:** SQL is the language; PostgreSQL is the database system that executes SQL queries.

## 3. Basic SQL Commands

SQL commands are commonly grouped by purpose.

| Category | Purpose                    | Examples                     |
| -------- | -------------------------- | ---------------------------- |
| DDL      | Define database structures | `CREATE`, `ALTER`, `DROP`    |
| DML      | Insert and modify records  | `INSERT`, `UPDATE`, `DELETE` |
| DQL      | Retrieve records           | `SELECT`                     |
| DCL      | Manage permissions         | `GRANT`, `REVOKE`            |
| TCL      | Manage transactions        | `COMMIT`, `ROLLBACK`         |

These categories are a common way to learn SQL commands.

## 4. Creating a Table

The `CREATE TABLE` statement defines the structure of a table.

```sql
CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    year INTEGER
);
```

### Explanation

- `CREATE TABLE books`: Creates a table named `books`.
- `id INTEGER`: Defines an integer column.
- `PRIMARY KEY`: Uniquely identifies each record.
- `VARCHAR(150)`: Stores text up to 150 characters.
- `NOT NULL`: Requires a value in the column.
- `year INTEGER`: Stores a numeric publication year.

In PostgreSQL, an identity column can generate IDs automatically:

```sql
CREATE TABLE books (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    year INTEGER
);
```

Use one of these table definitions, not both, for the same table.

## 5. Inserting Data — INSERT

The `INSERT` command adds new records.

```sql
INSERT INTO books (title, author, year)
VALUES ('Atomic Habits', 'James Clear', 2018);
```

Insert multiple books:

```sql
INSERT INTO books (title, author, year)
VALUES
    ('Deep Work', 'Cal Newport', 2016),
    ('Clean Code', 'Robert C. Martin', 2008);
```

**Use case:** When a user adds a new book through the Papertrail interface, the backend can insert that book into the database.

## 6. Reading Data — SELECT

The `SELECT` command retrieves records.

### Retrieve all columns

```sql
SELECT * FROM books;
```

### Retrieve specific columns

```sql
SELECT title, author FROM books;
```

### Retrieve one particular book

```sql
SELECT * FROM books
WHERE id = 1;
```

### Retrieve books by a specific author

```sql
SELECT * FROM books
WHERE author = 'James Clear';
```

### Find books published after 2010

```sql
SELECT * FROM books
WHERE year > 2010;
```

**Use case:** When the Papertrail frontend loads its book list, the backend can query the database and return the results.

## 7. Filtering Data — WHERE

The `WHERE` clause filters records based on conditions.

```sql
SELECT * FROM books
WHERE year >= 2010;
```

Common operators:

| Operator     | Meaning                             |
| ------------ | ----------------------------------- |
| `=`          | Equal to                            |
| `!=` or `<>` | Not equal to                        |
| `>`          | Greater than                        |
| `<`          | Less than                           |
| `>=`         | Greater than or equal to            |
| `<=`         | Less than or equal to               |
| `AND`        | Both conditions must be true        |
| `OR`         | At least one condition must be true |
| `IN`         | Matches any value in a list         |
| `LIKE`       | Matches a text pattern              |

### Example using AND

```sql
SELECT * FROM books
WHERE year > 2010
AND author = 'James Clear';
```

### Example using LIKE

```sql
SELECT * FROM books
WHERE title LIKE '%Code%';
```

In PostgreSQL, `ILIKE` can perform a case-insensitive pattern match.

## 8. Updating Data — UPDATE

The `UPDATE` command modifies existing records.

```sql
UPDATE books
SET year = 2019
WHERE id = 1;
```

This changes the year for the book whose ID is `1`.

Update multiple columns:

```sql
UPDATE books
SET title = 'Atomic Habits - Revised',
    year = 2019
WHERE id = 1;
```

**Important:** Always check your `WHERE` condition. Without it, every row in the table may be updated.

## 9. Deleting Data — DELETE

The `DELETE` command removes records.

```sql
DELETE FROM books
WHERE id = 2;
```

This deletes the book with ID `2`.

**Warning:** Running the following statement without a `WHERE` condition deletes all rows from the table:

```sql
DELETE FROM books;
```

The table itself remains. Use `DROP TABLE` only when you intend to remove the table structure too.

## 10. Sorting and Limiting Results

### Sort books by title

```sql
SELECT * FROM books
ORDER BY title ASC;
```

- `ASC`: Ascending order.
- `DESC`: Descending order.

### Get the newest publication years first

```sql
SELECT * FROM books
ORDER BY year DESC;
```

### Retrieve only five records

```sql
SELECT * FROM books
LIMIT 5;
```

These operations are useful when building book lists, search results, and pagination.

## 11. Aggregate Functions

Aggregate functions calculate values across multiple records.

### Count all books

```sql
SELECT COUNT(*) FROM books;
```

### Find the earliest publication year

```sql
SELECT MIN(year) FROM books;
```

### Find the latest publication year

```sql
SELECT MAX(year) FROM books;
```

### Find the average publication year

```sql
SELECT AVG(year) FROM books;
```

Other useful functions include `SUM()` for totals and `GROUP BY` for grouping records.

## 12. Primary Keys and Foreign Keys

### Primary Key

A primary key uniquely identifies each record.

```sql
id INTEGER PRIMARY KEY
```

For example, every book has its own ID.

### Foreign Key

A foreign key connects records in different tables.

Suppose Papertrail stores users and book reviews.

```sql
CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE reviews (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    review_text TEXT NOT NULL
);
```

Here:

- `users.id` identifies a user.
- `books.id` identifies a book.
- `reviews.user_id` references the user who wrote the review.
- `reviews.book_id` references the book being reviewed.

Foreign keys help maintain valid relationships between tables.

## 13. Database Relationships

| Relationship | Example                                                                                |
| ------------ | -------------------------------------------------------------------------------------- |
| One-to-One   | One user has one profile                                                               |
| One-to-Many  | One author has many books                                                              |
| Many-to-Many | A book can belong to multiple categories, and each category can contain multiple books |

A many-to-many relationship is commonly implemented using a junction table containing foreign keys to both related tables.

## 14. Joining Tables — JOIN

A `JOIN` combines related records from multiple tables.

For example, to retrieve reviews with the names of the users who wrote them:

```sql
SELECT users.name, reviews.review_text
FROM reviews
JOIN users ON reviews.user_id = users.id;
```

This matches each review with its associated user.

Common join types include:

- `INNER JOIN`: Returns matching records from both tables.
- `LEFT JOIN`: Returns all records from the left table and matching records from the right table.

## 15. Transactions — COMMIT and ROLLBACK

A transaction groups database operations into a unit of work.

```sql
BEGIN;

UPDATE books
SET year = 2019
WHERE id = 1;

COMMIT;
```

`COMMIT` saves the transaction's changes.

To cancel uncommitted changes:

```sql
BEGIN;

UPDATE books
SET year = 2019
WHERE id = 1;

ROLLBACK;
```

`ROLLBACK` reverses the changes made within that uncommitted transaction.

Transactions are important when multiple related changes must succeed or fail together.

## 16. How SQL Works in Papertrail

Your application can follow this architecture:

```text
React Frontend
      |
      | HTTP Request
      v
FastAPI Backend
      |
      | SQLAlchemy ORM
      v
Psycopg Driver
      |
      | SQL Queries
      v
PostgreSQL Database
```

### Example workflow

1. A user submits a new book through React.
2. React sends a request to FastAPI.
3. FastAPI validates the submitted data.
4. SQLAlchemy interacts with PostgreSQL through Psycopg.
5. PostgreSQL executes the required database operation.
6. FastAPI returns a response to React.

SQLAlchemy can generate SQL queries from Python ORM operations, so you do not have to write every query manually.

## 17. SQL vs Python in a Backend

### Python example

```python
books = {
    1: {"title": "Atomic Habits", "author": "James Clear"}
}

print(books[1])
```

### SQL example

```sql
SELECT * FROM books
WHERE id = 1;
```

The Python example retrieves a value from an in-memory dictionary. The SQL example retrieves a record from a database table.

In a real backend, Python handles application logic, while SQL retrieves and manages relational data.

## 18. Practice Exercises

1. Create a `books` table with `id`, `title`, `author`, and `year`.
2. Insert three book records.
3. Retrieve all books using `SELECT`.
4. Find books published after 2015.
5. Update the title of a book using its ID.
6. Delete a book using its ID.
7. Sort books alphabetically by title.
8. Count the total number of books.
9. Create a `users` table and a `reviews` table with foreign keys.
10. Use a `JOIN` to retrieve book reviews along with user names.

## 19. Key Takeaways

- SQL is used to manage and query relational databases.
- `CREATE TABLE` defines a table.
- `INSERT` adds records.
- `SELECT` retrieves records.
- `WHERE` filters records.
- `UPDATE` modifies records.
- `DELETE` removes records.
- Primary keys uniquely identify records, while foreign keys establish relationships.
- `JOIN` combines related records from multiple tables.
- Transactions help keep related database operations consistent.
- SQLAlchemy connects Python application logic with database operations.

**Conclusion:** SQL is an essential backend skill because it allows applications like Papertrail to store, retrieve, update, and organize book records efficiently using a relational database.
