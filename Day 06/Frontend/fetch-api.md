
# What Is the Fetch API?

## 1. Introduction

The **Fetch API** is a built-in JavaScript API that allows us to make HTTP requests and receive responses from servers.

It is commonly used to communicate between the frontend and backend of a web application.

For example, when you open a website and it displays a list of products retrieved from a database, the frontend can use the Fetch API to request those products from the backend.

### Why Do We Use the Fetch API?

- To retrieve data from a server.
- To send data to a backend.
- To communicate with REST APIs.
- To submit login and registration forms.
- To display dynamic data without reloading the entire page.
- To perform CRUD operations: Create, Read, Update, and Delete.

---

## 2. How Does the Fetch API Work?

The Fetch API follows a request-response process.

1. The user performs an action on the frontend.
2. JavaScript sends an HTTP request using `fetch()`.
3. The backend receives and processes the request.
4. The backend sends an HTTP response.
5. JavaScript reads the response.
6. The frontend displays the returned data.

### Example of Client-Server Communication

```text
Frontend (JavaScript)
        |
        | HTTP Request using fetch()
        v
Backend (FastAPI)
        |
        | Processes the request
        v
Database (if required)
        |
        | Data is retrieved
        v
Backend (FastAPI)
        |
        | HTTP Response (JSON)
        v
Frontend displays the data
```

---

## 3. Basic Syntax of Fetch API

```javascript
fetch(url, options)
```

### Parameters

- `url`: The URL of the API endpoint.
- `options`: An optional object containing the HTTP method, headers, request body, and other settings.

If the options are omitted, `fetch()` sends a GET request by default.

### Example

```javascript
fetch("https://jsonplaceholder.typicode.com/users")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```

### Explanation

- `fetch()` sends a request to the specified URL.
- `response.json()` reads the response body and parses JSON data.
- `.then(data => console.log(data))` displays the returned data.
- `.catch()` handles errors such as network failures.

**Important:** Fetch does not automatically reject its promise when the server returns an HTTP error status such as `404` or `500`. You should check `response.ok` or `response.status` yourself.

---

## 4. Fetch API with Async/Await

The `async/await` syntax makes asynchronous JavaScript easier to read.

```javascript
async function getUsers() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

getUsers();
```

### Explanation

- `async` declares an asynchronous function.
- `await fetch(...)` waits for the response headers to arrive.
- `response.ok` checks whether the HTTP status is in the successful range (200–299).
- `await response.json()` reads and parses the response body.
- `try...catch` handles network errors and errors thrown by our code.

The function does not block the entire JavaScript application while waiting for the server.

---

## 5. Fetch API with HTTP Methods

The Fetch API supports HTTP methods such as GET, POST, PUT, PATCH, and DELETE.

### A. GET Request

A GET request retrieves data from a server.

```javascript
async function getUser() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users/1"
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const user = await response.json();

  console.log(user);
}

getUser().catch(console.error);
```

**Purpose:** Retrieve user information.

### B. POST Request

A POST request commonly sends data to create a resource.

```javascript
async function createUser() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Abhay",
        email: "abhay@example.com"
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = await response.json();

  console.log(result);
}

createUser().catch(console.error);
```

**Purpose:** Send new user information to the server.

**Important concepts:**

- `method`: Specifies the HTTP method.
- `headers`: Indicates that the request body contains JSON.
- `JSON.stringify()`: Converts a JavaScript object into a JSON string.
- `body`: Contains the data sent to the server.

The example API is for practice. Its POST endpoint simulates creating a resource; it does not provide persistent storage for your application.

### C. PUT Request

PUT is generally used to replace a resource.

```javascript
async function updateUser() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users/1",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: 1,
        name: "Abhay",
        email: "newemail@example.com"
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = await response.json();

  console.log(result);
}

updateUser().catch(console.error);
```

**Purpose:** Send a replacement representation of a resource.

### D. PATCH Request

PATCH is generally used to update selected fields of a resource.

```javascript
async function updateEmail() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users/1",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "newemail@example.com"
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const result = await response.json();

  console.log(result);
}

updateEmail().catch(console.error);
```

**Purpose:** Update only the email field in this example.

### E. DELETE Request

A DELETE request asks the server to delete a resource.

```javascript
async function deleteUser() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users/1",
    {
      method: "DELETE"
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  console.log("Delete request completed successfully.");
}

deleteUser().catch(console.error);
```

**Purpose:** Request deletion of user 1.

Note that a successful DELETE request may return an empty response body. Do not call `response.json()` unless the server actually returns JSON.

---

## 6. Connecting Fetch API to a FastAPI Backend

Suppose we have created a backend using FastAPI.

### Python Backend (`main.py`)

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
def get_users():
    return [
        {"id": 1, "name": "Abhay"},
        {"id": 2, "name": "Aman"}
    ]
```

Run the backend:

```bash
fastapi dev main.py
```

The API endpoint is:

```text
http://127.0.0.1:8000/users
```

### JavaScript Frontend

```javascript
async function loadUsers() {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/users"
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const users = await response.json();

    console.log(users);
  } catch (error) {
    console.error("Failed to load users:", error);
  }
}

loadUsers();
```

### Expected Response

```json
[
  {
    "id": 1,
    "name": "Abhay"
  },
  {
    "id": 2,
    "name": "Aman"
  }
]
```

The JavaScript frontend requests data from FastAPI, and FastAPI returns the data as JSON.

**CORS note:** If your frontend and backend use different origins (for example, different ports), the browser may require CORS configuration on the FastAPI backend. An origin consists of the scheme, hostname, and port.

---

## 7. Important Fetch API Concepts

| Concept | Explanation |
|---|---|
| `fetch()` | Sends an HTTP request. |
| Promise | Represents the eventual result of an asynchronous operation. |
| `async` | Declares an asynchronous function. |
| `await` | Waits for a promise to settle within an async function. |
| `response.json()` | Reads the body and parses JSON. |
| `response.ok` | Indicates whether the status is between 200 and 299. |
| `response.status` | Provides the HTTP status code. |
| `headers` | Contains request metadata such as content type. |
| `body` | Contains data sent with a request, when applicable. |
| `JSON.stringify()` | Converts a JavaScript value into a JSON string. |
| `try...catch` | Handles thrown errors and rejected promises. |

---

## 8. Fetch API vs. Axios

| Feature | Fetch API | Axios |
|---|---|---|
| Type | Built into modern browsers | External library |
| Installation | Not required in browsers | Usually installed as a dependency |
| JSON handling | Parse with `response.json()` | Automatically parses typical JSON responses |
| HTTP errors | Check `response.ok` | Rejects promises for non-2xx statuses by default |
| Basic request | `fetch(url)` | `axios.get(url)` |

Both can be used to communicate with REST APIs.

---

## 9. Advantages of the Fetch API

- Built into modern browsers.
- Supports standard HTTP methods.
- Works with JSON and other response types.
- Supports asynchronous requests.
- Integrates with promises and async/await.
- Allows frontend applications to communicate with backend APIs.
- Supports cancellation through `AbortController`.

## 10. Common Mistakes

1. Forgetting to check `response.ok`.
2. Forgetting to use `JSON.stringify()` when sending a JSON body.
3. Forgetting the `Content-Type: application/json` header when appropriate.
4. Calling `response.json()` on an empty response.
5. Assuming a network request failure and an HTTP error status are the same.
6. Forgetting that browser CORS policies may prevent access to a response.
7. Assuming the server permanently stores data simply because a POST request succeeds.

---

## 11. Conclusion

The Fetch API is a JavaScript feature that allows frontend applications to communicate with backend servers through HTTP requests and responses.

It is widely used to retrieve data, submit forms, and interact with REST APIs.

When working with FastAPI, the Fetch API can connect a JavaScript frontend to Python backend endpoints.

**Key takeaway:** `fetch()` sends the request, the backend processes it, and JavaScript reads the response to update the frontend.
