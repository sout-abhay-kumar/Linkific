# REST API and HTTP Methods

## 1. What Is a REST API?

REST stands for Representational State Transfer.

A REST API is a way for a frontend and backend to communicate over HTTP using URLs and standard HTTP methods.

For example, in a Book Library application:

- React is the frontend.
- FastAPI is the backend.
- SQLite is the database.

React sends HTTP requests to FastAPI, and FastAPI processes them and returns responses, often in JSON format.

### How It Works

1. The user performs an action in React.
2. React sends an HTTP request to the backend.
3. FastAPI processes the request.
4. The backend may read or modify database records.
5. FastAPI returns an HTTP response.
6. React displays the result.

Example request:

```http
GET /books
```

Example JSON response:

```json
[
  {
    "id": 1,
    "title": "Atomic Habits",
    "author": "James Clear"
  }
]
```

---

## 2. What Are HTTP Methods?

HTTP methods tell the backend what action the client wants to perform on a resource.

For example, `/books` represents the collection of books.

| HTTP Method | Purpose                      | CRUD Operation |
| ----------- | ---------------------------- | -------------- |
| GET         | Retrieve data                | Read           |
| POST        | Create new data              | Create         |
| PUT         | Replace an existing resource | Update         |
| PATCH       | Partially update a resource  | Update         |
| DELETE      | Remove a resource            | Delete         |

---

## 3. GET — Retrieve Data

GET is used to retrieve information from the server.

Example:

```http
GET /books
```

This returns all books.

To retrieve one book:

```http
GET /books/1
```

FastAPI example:

```python
@app.get("/books")
def get_books():
    return books
```

**Use case:** Display the book collection on the React Books page.

---

## 4. POST — Create Data

POST is used to submit data to create a new resource.

Example:

```http
POST /books
```

Request body:

```json
{
  "title": "Atomic Habits",
  "author": "James Clear"
}
```

FastAPI example:

```python
from pydantic import BaseModel

class BookCreate(BaseModel):
    title: str
    author: str

@app.post("/books", status_code=201)
def create_book(book: BookCreate):
    new_book = {
        "id": len(books) + 1,
        "title": book.title,
        "author": book.author
    }

    books.append(new_book)
    return new_book
```

**Use case:** Add a new book through a form in React.

---

## 5. PUT — Replace Existing Data

PUT is generally used to replace an existing resource with the supplied representation.

Example:

```http
PUT /books/1
```

Request body:

```json
{
  "title": "Deep Work",
  "author": "Cal Newport"
}
```

FastAPI example:

```python
@app.put("/books/{book_id}")
def update_book(book_id: int, book: BookCreate):
    for existing_book in books:
        if existing_book["id"] == book_id:
            existing_book["title"] = book.title
            existing_book["author"] = book.author
            return existing_book

    raise HTTPException(status_code=404, detail="Book not found")
```

**Use case:** Replace a book's editable details.

---

## 6. PATCH — Partially Update Data

PATCH is used to update only selected fields of an existing resource.

Example:

```http
PATCH /books/1
```

Request body:

```json
{
  "title": "The Pragmatic Programmer"
}
```

Only the title needs to change; other fields remain unchanged.

**Use case:** Change a book's title without resubmitting its author or other details.

---

## 7. DELETE — Remove Data

DELETE is used to remove a resource.

Example:

```http
DELETE /books/1
```

FastAPI example:

```python
@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    for index, book in enumerate(books):
        if book["id"] == book_id:
            deleted_book = books.pop(index)
            return {
                "message": "Book deleted successfully",
                "book": deleted_book
            }

    raise HTTPException(status_code=404, detail="Book not found")
```

**Use case:** Delete a book from the library.

---

## 8. What Is an API Endpoint?

An endpoint is a URL and HTTP method combination used to access a particular API operation.

Example endpoints:

| Method | Endpoint   | Action                  |
| ------ | ---------- | ----------------------- |
| GET    | `/books`   | Get all books           |
| GET    | `/books/1` | Get one book            |
| POST   | `/books`   | Create a book           |
| PUT    | `/books/1` | Replace a book          |
| PATCH  | `/books/1` | Partially update a book |
| DELETE | `/books/1` | Delete a book           |

The same URL can support different methods to perform different actions.

---

## 9. Important HTTP Status Codes

Status codes tell the client what happened when the server processed a request.

| Status Code               | Meaning                                 |
| ------------------------- | --------------------------------------- |
| 200 OK                    | Request succeeded                       |
| 201 Created               | Resource created successfully           |
| 204 No Content            | Request succeeded with no response body |
| 400 Bad Request           | Request contains invalid input          |
| 401 Unauthorized          | Authentication is required or invalid   |
| 403 Forbidden             | Client does not have permission         |
| 404 Not Found             | Resource does not exist                 |
| 422 Unprocessable Content | Request data failed validation          |
| 500 Internal Server Error | Unexpected server-side error            |

Example: If the client requests `GET /books/999` and that book does not exist, the API can return `404 Not Found`.

---

## 10. Testing REST APIs with Postman

Postman lets you test APIs without building the frontend first.

Steps:

1. Start your FastAPI server.
2. Open Postman.
3. Select an HTTP method, such as GET or POST.
4. Enter the endpoint URL, such as `http://127.0.0.1:8000/books`.
5. For POST, PUT, or PATCH, add the appropriate JSON body.
6. Click Send.
7. Check the response body and status code.

FastAPI also provides interactive API documentation at:

`http://127.0.0.1:8000/docs`

---

## 11. REST API vs. HTTP Methods

- **REST API:** An architectural approach for designing web APIs.
- **HTTP:** The protocol used for communication between clients and servers.
- **HTTP methods:** Specify the intended action for a request.
- **Endpoint:** The URL and method used to access an API operation.
- **JSON:** A common format for sending and receiving data.

## 12. Quick Revision

Remember CRUD:

- **Create → POST**
- **Read → GET**
- **Update → PUT or PATCH**
- **Delete → DELETE**

In your Book Library project, React sends these requests to FastAPI. FastAPI validates the data, interacts with SQLite when necessary, and returns a response that React can display.
