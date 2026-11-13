## 1. What Is an API?

API stands for **Application Programming Interface**. An API defines how two software applications communicate with each other.

In a web application, the frontend commonly uses an API to communicate with the backend.

For example, in an Expense Tracker:

1. A user opens the React application.
2. The user requests their expenses.
3. React sends an HTTP request to the FastAPI backend.
4. FastAPI processes the request and communicates with PostgreSQL.
5. FastAPI sends an HTTP response to React.
6. React reads the response and displays the expenses.

This process is called **API consumption**: using an API exposed by another application or service.

## 2. Client and Server

| Term         | Meaning                                          | Expense Tracker example   |
| ------------ | ------------------------------------------------ | ------------------------- |
| Client       | Application that makes a request                 | React frontend            |
| Server       | Application that receives and processes requests | FastAPI backend           |
| API endpoint | URL where a particular operation is available    | `/api/expenses`           |
| Request      | Message sent by the client                       | Request to fetch expenses |
| Response     | Message returned by the server                   | Expense data in JSON      |

The frontend does not normally connect directly to PostgreSQL. It communicates with the backend API, and the backend handles database operations.

## 3. HTTP Methods

HTTP methods tell the server what operation the client wants to perform.

| Method   | Purpose                     | Example                         |
| -------- | --------------------------- | ------------------------------- |
| `GET`    | Retrieve data               | Get all expenses                |
| `POST`   | Create a new resource       | Add an expense                  |
| `PUT`    | Replace/update a resource   | Update an expense               |
| `PATCH`  | Partially update a resource | Change only an expense category |
| `DELETE` | Delete a resource           | Remove an expense               |

Example endpoints:

```text
GET     /api/expenses
GET     /api/expenses/12
POST    /api/expenses
PUT     /api/expenses/12
PATCH   /api/expenses/12
DELETE  /api/expenses/12
```

The exact methods and routes depend on how the backend API is designed.

## 4. Understanding an API Request

An HTTP request can contain several important parts:

- **URL:** The address of the API endpoint.
- **Method:** The operation being requested, such as `GET` or `POST`.
- **Headers:** Additional information, such as content type or authentication.
- **Body:** Data sent to the server, commonly with `POST`, `PUT`, or `PATCH`.
- **Query parameters:** Optional values added to a URL to filter, sort, or paginate results.

Example request:

```http
POST /api/expenses
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Request body:

```json
{
  "title": "Groceries",
  "amount": 850,
  "category": "Food"
}
```

The `Authorization` header is included when the API requires a valid access token. Never put a real token or password in source code, screenshots, or a public repository.

## 5. Understanding an API Response

After processing a request, the server returns an HTTP response.

A response commonly contains:

- **Status code:** Indicates whether the request succeeded or failed.
- **Headers:** Metadata about the response.
- **Body:** The returned data or error details.

Example successful JSON response:

```json
{
  "id": 12,
  "title": "Groceries",
  "amount": 850,
  "category": "Food"
}
```

### Common HTTP status codes

| Status code                 | Meaning                                      | Typical situation                           |
| --------------------------- | -------------------------------------------- | ------------------------------------------- |
| `200 OK`                    | Request succeeded                            | Expense retrieved or updated                |
| `201 Created`               | Resource created                             | New expense added                           |
| `204 No Content`            | Request succeeded with no response body      | Expense deleted                             |
| `400 Bad Request`           | Request is invalid                           | Invalid request format                      |
| `401 Unauthorized`          | Authentication is missing or invalid         | Token is missing or expired                 |
| `403 Forbidden`             | User is not allowed to perform the operation | User tries to access another user's expense |
| `404 Not Found`             | Resource does not exist                      | Expense ID was not found                    |
| `422 Unprocessable Content` | Request data failed validation               | Amount has an invalid type                  |
| `500 Internal Server Error` | Unexpected server error                      | Backend encounters an unhandled error       |

The exact status code depends on the API implementation.

## 6. JSON: The Common Data Format

JSON stands for **JavaScript Object Notation**. It is a text-based format commonly used to exchange data between frontend and backend applications.

Example:

```json
{
  "id": 1,
  "title": "Internet Bill",
  "amount": 999,
  "category": "Utilities",
  "is_paid": true
}
```

JavaScript can work with JSON using:

```javascript
// Convert a JSON string into a JavaScript value
const expense = JSON.parse(jsonString);

// Convert a JavaScript value into a JSON string
const jsonString = JSON.stringify(expense);
```

When using `fetch()`, calling `response.json()` reads the response body and parses JSON into a JavaScript value.

## 7. Consuming an API in React Using Fetch

The browser's built-in `fetch()` function sends HTTP requests.

### GET: Retrieve expenses

```javascript
async function getExpenses() {
  try {
    const response = await fetch("http://localhost:8000/api/expenses");

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const expenses = await response.json();

    console.log(expenses);
    return expenses;
  } catch (error) {
    console.error("Could not fetch expenses:", error);
    throw error;
  }
}
```

### POST: Create an expense

```javascript
async function createExpense(expenseData, accessToken) {
  try {
    const response = await fetch("http://localhost:8000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(expenseData),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Could not create expense:", error);
    throw error;
  }
}

const newExpense = {
  title: "Groceries",
  amount: 850,
  category: "Food",
};

// Example usage:
// createExpense(newExpense, accessToken);
```

The example assumes the backend requires a bearer token. Use the authentication method specified by your own API.

### Important Fetch concepts

- `fetch()` returns a Promise.
- `await` waits for that Promise to settle.
- `response.ok` is `true` for HTTP status codes from 200 to 299.
- `response.json()` reads and parses a JSON response body.
- `JSON.stringify()` converts a JavaScript value into JSON text for a request body.
- `fetch()` does not automatically throw an error for HTTP responses such as `404` or `500`. Check `response.ok` or `response.status`.
- Network failures, such as a server being unreachable, can cause `fetch()` to reject.

## 8. Consuming an API in React Using Axios

Axios is a popular HTTP client library. It provides a convenient interface for sending requests.

Install it in the frontend project:

```bash
npm install axios
```

### GET using Axios

```javascript
import axios from "axios";

async function getExpenses() {
  try {
    const response = await axios.get("http://localhost:8000/api/expenses");

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Could not fetch expenses:", error);
    throw error;
  }
}
```

### POST using Axios

```javascript
async function createExpense(expenseData, accessToken) {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/expenses",
      expenseData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Could not create expense:", error);
    throw error;
  }
}
```

Axios automatically serializes ordinary JavaScript objects as JSON and parses JSON responses. It rejects the Promise for non-success HTTP status codes by default.

## 9. Fetch vs Axios

| Feature               | Fetch                          | Axios                                 |
| --------------------- | ------------------------------ | ------------------------------------- |
| Installation          | Built into modern browsers     | Must be installed                     |
| GET request           | `fetch(url)`                   | `axios.get(url)`                      |
| POST body             | Usually use `JSON.stringify()` | Pass the JavaScript object            |
| Read JSON response    | Call `response.json()`         | Read `response.data`                  |
| HTTP error handling   | Check `response.ok` manually   | Rejects for non-2xx status by default |
| Interceptors          | Not built in                   | Supported                             |
| Basic API consumption | Good choice                    | Good choice                           |

Both are valid. Choose one based on the needs of the project and use it consistently.

## 10. Using React State to Display API Data

API data is commonly stored in React state.

```jsx
import { useEffect, useState } from "react";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadExpenses() {
      try {
        const response = await fetch("http://localhost:8000/api/expenses");

        if (!response.ok) {
          throw new Error("Failed to load expenses");
        }

        const data = await response.json();
        setExpenses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, []);

  if (loading) return <p>Loading expenses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          {expense.title} - ₹{expense.amount}
        </li>
      ))}
    </ul>
  );
}

export default ExpenseList;
```

### Why use these React hooks?

- `useState()` stores the expenses, loading state, and error message.
- `useEffect()` runs the data-fetching operation when the component mounts.
- `setExpenses()` updates the state after the API returns data.
- React re-renders the component when state changes.
- `key={expense.id}` gives each list item a stable identity.

## 11. API Consumption and CRUD

CRUD operations are commonly connected to HTTP methods.

| CRUD operation | HTTP method  | Example                |
| -------------- | ------------ | ---------------------- |
| Create         | POST         | Add a new expense      |
| Read           | GET          | Display saved expenses |
| Update         | PUT or PATCH | Edit an expense        |
| Delete         | DELETE       | Remove an expense      |

A typical user flow:

1. The user submits the Add Expense form.
2. React sends a `POST` request to FastAPI.
3. FastAPI validates the data and saves it to PostgreSQL.
4. FastAPI returns the created expense.
5. React updates the interface, either by using the returned expense or fetching the list again.

## 12. Authentication and API Consumption

Some APIs are public, while others require authentication.

For a bearer-token API, the frontend sends the access token in the request header:

```javascript
const response = await fetch("http://localhost:8000/api/expenses", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

Important security practices:

- Never hard-code secrets, passwords, or private API keys in frontend code.
- Frontend environment variables prefixed with `VITE_` are included in the client bundle. They are not secret.
- The backend must verify the token and check that the authenticated user owns the requested data.
- Do not trust a user ID supplied by the frontend as proof of ownership.
- Use HTTPS in production.
- Handle expired tokens and unauthorized responses safely.
- Avoid logging access tokens or sensitive financial information.

## 13. CORS (Cross-Origin Resource Sharing)

During local development, React and FastAPI often run on different origins:

```text
React:   http://localhost:5173
FastAPI: http://localhost:8000
```

An origin consists of the scheme, host, and port. Because these origins differ, the browser applies its cross-origin security rules.

**CORS** is a browser security mechanism that allows a server to specify which origins may access its resources.

FastAPI example:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

In production, configure the exact frontend origins you trust. Do not use a wildcard origin with credentialed requests.

CORS is enforced by browsers; it is not a replacement for authentication or authorization.

## 14. Query Parameters and Filtering

Query parameters allow clients to request a filtered or limited set of data.

Example URL:

```text
GET /api/expenses?category=Food&limit=10
```

React example:

```javascript
const params = new URLSearchParams({
  category: "Food",
  limit: "10",
});

const response = await fetch(`http://localhost:8000/api/expenses?${params}`);
```

The backend must implement and validate these query parameters for them to have an effect.

Common uses include:

- Filtering by category.
- Searching by expense title.
- Selecting a date range.
- Sorting by amount or date.
- Pagination.

## 15. Common API Consumption Errors

| Problem                     | Possible reason                                               | What to check                                 |
| --------------------------- | ------------------------------------------------------------- | --------------------------------------------- |
| `Failed to fetch`           | Backend is unavailable or a network issue occurred            | Start FastAPI and check the API URL           |
| `404 Not Found`             | Endpoint path is incorrect                                    | Verify the route in FastAPI                   |
| `405 Method Not Allowed`    | HTTP method is not supported by the route                     | Check `GET`, `POST`, etc.                     |
| `401 Unauthorized`          | Missing, invalid, or expired token                            | Check the authentication flow                 |
| `403 Forbidden`             | Authenticated user lacks permission                           | Check backend authorization                   |
| `422 Unprocessable Content` | Request data failed validation                                | Compare the JSON body with the schema         |
| CORS error                  | Backend CORS configuration does not allow the frontend origin | Check scheme, host, port, and allowed headers |
| JSON parsing error          | Response body is not valid JSON or has no body                | Inspect the response and status code          |

Useful debugging tools:

- Browser Developer Tools → Network tab.
- Browser Developer Tools → Console.
- FastAPI Swagger documentation, usually `http://localhost:8000/docs`.
- Postman or another API testing client.
- FastAPI terminal logs.

## 16. Recommended API Consumption Workflow

When connecting a React page to a backend API:

1. Confirm that the backend is running.
2. Open the endpoint in Swagger or test it with Postman.
3. Confirm the HTTP method, URL, request body, and expected response.
4. Check whether authentication is required.
5. Write the frontend API request.
6. Handle loading, success, empty, and error states.
7. Display the returned data in React.
8. Test invalid input, missing tokens, and server failures.
9. Verify that users can access only their own records.

For a larger React application, keep API requests in a separate service/module rather than placing all request logic inside UI components.

## 17. Key Terms to Remember

| Term           | Short explanation                                     |
| -------------- | ----------------------------------------------------- |
| API            | Interface through which applications communicate      |
| Endpoint       | Specific API URL                                      |
| HTTP           | Protocol used for web communication                   |
| Request        | Message sent to an API                                |
| Response       | Message returned by an API                            |
| HTTP method    | Describes the requested operation                     |
| Header         | Metadata sent with a request or response              |
| Request body   | Data sent to the server                               |
| JSON           | Common data-exchange format                           |
| Status code    | Indicates the result of a request                     |
| Promise        | JavaScript object representing an asynchronous result |
| `async/await`  | Syntax for working with Promises                      |
| Authentication | Verifying who the user is                             |
| Authorization  | Checking what the user is allowed to do               |
| CORS           | Browser mechanism for controlling cross-origin access |
