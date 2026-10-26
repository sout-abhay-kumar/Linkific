
# Fetch API vs Axios

## 1. What Are Fetch API and Axios?

Fetch API and Axios are used to send HTTP requests from a frontend application to a backend API.

For example, in Papertrail:

- Frontend: React
- Backend: FastAPI
- Database: PostgreSQL

React sends a request to FastAPI, and FastAPI returns data, usually in JSON format.

Both Fetch and Axios can perform operations such as:

- GET: Retrieve data.
- POST: Create data.
- PUT: Update data.
- PATCH: Partially update data.
- DELETE: Delete data.

## 2. What Is the Fetch API?

The Fetch API is a built-in browser feature for making HTTP requests.

You do not need to install an additional package to use it in a modern browser.

### Example: Fetch Books

```javascript
async function getBooks() {
    try {
        const response = await fetch(
            "http://localhost:8000/api/books"
        );

        if (!response.ok) {
            throw new Error(
                `HTTP error: ${response.status}`
            );
        }

        const books = await response.json();

        console.log(books);
    } catch (error) {
        console.error(
            "Failed to fetch books:",
            error.message
        );
    }
}

getBooks();
```

### Explanation

- `fetch(url)` sends an HTTP request.
- `await` waits for the request to complete.
- `response.ok` checks whether the HTTP status is successful (200–299).
- `response.json()` parses the response body as JSON.
- `try...catch` handles network errors and errors thrown in the `try` block.

**Important:** Fetch does not automatically reject its promise for HTTP errors such as 404 or 500. You should check `response.ok`.

## 3. What Is Axios?

Axios is an HTTP client library used to make requests to APIs.

Unlike Fetch, Axios is not built into the browser, so you normally install it as a dependency.

### Installation

Run this command inside your React frontend directory:

```bash
npm install axios
```

### Example: Fetch Books Using Axios

```javascript
import axios from "axios";

async function getBooks() {
    try {
        const response = await axios.get(
            "http://localhost:8000/api/books"
        );

        console.log(response.data);
    } catch (error) {
        console.error(
            "Failed to fetch books:",
            error.message
        );
    }
}

getBooks();
```

### Explanation

- `axios.get(url)` sends a GET request.
- `await` waits for the request to complete.
- `response.data` contains the response body.
- Axios automatically parses ordinary JSON responses.
- Axios rejects the promise by default for HTTP statuses outside the configured success range, normally 200–299.

## 4. Fetch vs Axios: Main Differences

| Feature | Fetch API | Axios |
|---|---|---|
| Installation | Built into modern browsers | Install using npm |
| GET request | `fetch(url)` | `axios.get(url)` |
| JSON response | `await response.json()` | `response.data` |
| HTTP errors | Check `response.ok` manually | Rejects for non-2xx statuses by default |
| Sending JSON | Set headers and use `JSON.stringify()` | Use `data` or pass an object as request data |
| Interceptors | No built-in interceptor system | Supports request and response interceptors |
| Timeout | Configure using `AbortSignal` | Supports a `timeout` option |
| Cancellation | Supports `AbortController` | Supports `AbortController` in modern versions |
| Dependencies | No extra package | Additional dependency |

Both support asynchronous requests and can be used with `async` and `await`.

## 5. Sending Data With POST

### Using Fetch

```javascript
async function createBook() {
    const response = await fetch(
        "http://localhost:8000/api/books",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Atomic Habits",
                author: "James Clear",
                category: "Personal Growth"
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status}`
        );
    }

    const book = await response.json();

    console.log(book);
}
```

### Using Axios

```javascript
import axios from "axios";

async function createBook() {
    const response = await axios.post(
        "http://localhost:8000/api/books",
        {
            title: "Atomic Habits",
            author: "James Clear",
            category: "Personal Growth"
        }
    );

    console.log(response.data);
}
```

**Note:** The example assumes the FastAPI `BookInput` schema accepts these fields. Include all other required fields from your actual schema when making a real request.

## 6. How React Communicates With FastAPI

The data flow is:

```text
React Frontend
      |
      | Fetch or Axios request
      v
FastAPI Backend
      |
      | SQLAlchemy query
      v
PostgreSQL Database
      |
      | Database records
      v
FastAPI returns JSON
      |
      | HTTP response
      v
React displays the data
```

Fetch and Axios handle HTTP communication. They do not directly query PostgreSQL; your backend handles database operations.

## 7. Error Handling

### Fetch API

Fetch rejects its promise for network-level failures, but HTTP errors usually need a manual check.

```javascript
try {
    const response = await fetch(
        "http://localhost:8000/api/books"
    );

    if (!response.ok) {
        throw new Error(
            `HTTP error: ${response.status}`
        );
    }

    const data = await response.json();

    console.log(data);
} catch (error) {
    console.error(error.message);
}
```

### Axios

Axios rejects the promise for non-2xx HTTP responses by default.

```javascript
try {
    const response = await axios.get(
        "http://localhost:8000/api/books"
    );

    console.log(response.data);
} catch (error) {
    if (error.response) {
        console.error(
            "Server error:",
            error.response.status
        );
    } else if (error.request) {
        console.error(
            "No response received from the server."
        );
    } else {
        console.error(error.message);
    }
}
```

Axios error information:

- `error.response`: The server returned a response with an unsuccessful status.
- `error.request`: A request was made, but no response was received.
- `error.message`: A general error description.

## 8. Which One Should You Use?

### Use Fetch when:

- You are learning frontend-backend communication.
- Your project needs straightforward API requests.
- You want to avoid additional dependencies.
- You prefer the browser's built-in functionality.

### Use Axios when:

- You want request and response interceptors.
- You want convenient shared configuration through Axios instances.
- Your application has many API endpoints.
- You prefer its response and error-handling conventions.

Neither is universally better. Both are suitable for production applications.

## 9. Fetch and Axios in Papertrail

For the Papertrail Book Library, you can use either option.

Example endpoint:

```text
GET http://localhost:8000/api/books
```

A successful response might look like:

```json
[
    {
        "id": 1,
        "title": "Atomic Habits",
        "author": "James Clear",
        "category": "Personal Growth"
    }
]
```

React receives the JSON data and uses it to render book cards or a list.

Your existing FastAPI response schema determines the actual fields returned.

## 10. Common Mistakes

- Forgetting to check `response.ok` when using Fetch.
- Forgetting `await response.json()` when parsing a Fetch response.
- Using `response.json()` with Axios instead of accessing `response.data`.
- Forgetting to install Axios before importing it.
- Sending an incorrectly formatted request body.
- Ignoring errors when the backend is offline.
- Assuming Fetch or Axios automatically fixes CORS errors.
- Exposing secret API keys in frontend code.

## 11. Key Takeaways

- Fetch API is built into modern browsers.
- Axios is an external HTTP client library.
- Both send HTTP requests and receive responses.
- Fetch requires explicit HTTP status checking.
- Axios parses JSON responses automatically and rejects unsuccessful HTTP responses by default.
- Both support GET, POST, PUT, PATCH, and DELETE requests.
- Neither replaces FastAPI or directly accesses the database.
- CORS must still be configured appropriately for browser-based cross-origin requests.


