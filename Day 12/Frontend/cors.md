
# CORS (Cross-Origin Resource Sharing)

## 1. What Is CORS?

CORS stands for **Cross-Origin Resource Sharing**.

It is a browser security mechanism that controls whether JavaScript running on one origin is allowed to access responses from a different origin.

CORS is based on HTTP headers sent by the server.

## 2. What Is an Origin?

An origin consists of three parts:

- Protocol: `http` or `https`
- Domain: `localhost`, `example.com`, etc.
- Port: `5173`, `8000`, etc.

Example:

| Application | URL |
|---|---|
| React frontend | `http://localhost:5173` |
| FastAPI backend | `http://localhost:8000` |

These are different origins because their ports are different.

Even though both use `localhost`, the browser treats them as separate origins.

## 3. Why Do We Need CORS?

Suppose your React application fetches book records from FastAPI:

```javascript
const response = await fetch(
  "http://localhost:8000/api/books"
);

const books = await response.json();
```

The browser checks whether the backend permits the frontend origin.

If the backend does not provide the appropriate CORS headers, the browser may prevent JavaScript from reading the response.

This is why a CORS error can appear in the browser console.

## 4. How Does CORS Work?

The process is:

1. React sends a request to FastAPI.
2. The browser applies its cross-origin security rules.
3. FastAPI responds with the requested data and relevant HTTP headers.
4. The browser checks whether the response is permitted for the requesting origin.
5. If permitted, JavaScript can access the response. Otherwise, the browser blocks access to it.

Some requests require a **preflight request** before the actual request.

## 5. What Is a Preflight Request?

A preflight request is an HTTP `OPTIONS` request sent by the browser to check whether a cross-origin request is permitted.

It is commonly needed for requests that use:

- Methods such as `PUT` or `DELETE`
- Certain non-safelisted request headers
- Content types such as `application/json` on a cross-origin `POST`

The server responds with headers describing the permitted origins, methods, and headers.

If the preflight check fails, the browser generally does not send the actual request.

Not every cross-origin request requires preflight.

## 6. How to Enable CORS in FastAPI

Install FastAPI if it is not already installed:

```bash
pip install fastapi uvicorn
```

Example configuration:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/books")
def get_books():
    return [
        {
            "id": 1,
            "title": "Atomic Habits",
            "author": "James Clear",
        }
    ]
```

### Explanation of the Settings

| Setting | Purpose |
|---|---|
| `allow_origins` | Specifies permitted origins. |
| `allow_credentials=True` | Allows credentialed browser requests when other requirements are met. |
| `allow_methods=["*"]` | Allows all HTTP methods under the CORS policy. |
| `allow_headers=["*"]` | Allows requested headers under the CORS policy. |

For production, configure only the origins, methods, and headers your application needs.

## 7. Does CORS Protect the Backend From Everyone?

**No. CORS is not authentication or authorization.**

It primarily controls cross-origin access by browser JavaScript.

| Request source | Can CORS prevent access? |
|---|---|
| React application from an allowed origin | Allows access if other CORS checks pass. |
| JavaScript from an unapproved website | Prevents JavaScript from reading the response when the origin is not permitted. |
| Postman | CORS is not enforced by Postman. |
| Python script | CORS is not enforced by Python clients. |
| Another backend server | CORS is not enforced by the server itself. |

A request may reach the backend even when the browser later blocks JavaScript from reading the response.

Some cross-origin requests can be sent without a preflight check, so CORS is not a general-purpose request blocker.

## 8. CORS vs Authentication vs Authorization

| Concept | Purpose |
|---|---|
| CORS | Controls browser access to cross-origin responses. |
| Authentication | Verifies who the user is. |
| Authorization | Determines what the user is allowed to do. |
| Input validation | Checks whether incoming data is valid. |
| Rate limiting | Restricts excessive requests. |
| HTTPS | Encrypts communication in transit. |

For example, in a book library application, CORS does not prevent an unauthorized person from attempting to delete a book through an API client.

The backend must enforce authentication and authorization where required.

## 9. CORS in the Papertrail Project

Project architecture:

```text
React Frontend
localhost:5173
       |
       | HTTP request
       v
FastAPI Backend
localhost:8000
       |
       | SQLAlchemy
       v
PostgreSQL Database
```

CORS allows the browser-based React application to read responses from FastAPI when the configured origin is permitted.

FastAPI remains responsible for validating requests, enforcing permissions, and safely interacting with PostgreSQL.

## 10. Common CORS Mistakes

- Forgetting to add `CORSMiddleware`.
- Adding middleware before defining the FastAPI `app`.
- Using the wrong frontend port in `allow_origins`.
- Confusing `localhost` with `127.0.0.1`.
- Using an origin with an incorrect protocol or port.
- Assuming CORS errors always mean the backend is offline.
- Assuming CORS protects an API from Postman or Python scripts.
- Using `allow_origins=["*"]` without understanding the security implications of the configuration.

An origin includes the scheme, hostname, and port, but not a URL path.

## 11. Key Takeaways

- CORS stands for Cross-Origin Resource Sharing.
- Different ports create different origins.
- Browsers use CORS rules to control cross-origin response access.
- Some requests require a preflight `OPTIONS` request.
- FastAPI provides `CORSMiddleware` to configure CORS.
- CORS does not replace authentication or authorization.
- Public API endpoints must enforce their own security requirements.
