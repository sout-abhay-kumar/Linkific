# API Flow in FastAPI

## 1. What is API Flow?

API Flow describes how data travels between different components of an application through an API.

In a full-stack application, the frontend sends requests to the backend. The backend processes those requests, communicates with the database when necessary, and sends responses back to the frontend.

For example, when a user adds a new expense in ExpenseTracker:

1. The user enters expense details in the React application.
2. React sends an HTTP request to the FastAPI backend.
3. FastAPI receives and validates the request.
4. The backend executes the required business logic.
5. SQLAlchemy communicates with PostgreSQL.
6. PostgreSQL stores the expense.
7. FastAPI returns a JSON response.
8. React receives the response and updates the interface.

---

## 2. Main Components Involved in API Flow

Our ExpenseTracker application uses the following components:

| Component      | Technology           | Responsibility                         |
| -------------- | -------------------- | -------------------------------------- |
| Frontend       | React                | Collects user input and displays data  |
| HTTP Client    | Fetch / Axios        | Sends API requests                     |
| Backend        | FastAPI              | Handles requests and application logic |
| Validation     | Pydantic             | Validates incoming request data        |
| ORM            | SQLAlchemy           | Communicates with the database         |
| Database       | PostgreSQL           | Stores application data                |
| Authentication | Google Sign-In + JWT | Authenticates and authorizes users     |

### How They Work Together

- **React:** Provides the user interface.
- **HTTP Client:** Sends requests from React to FastAPI.
- **FastAPI:** Receives requests and executes backend operations.
- **Pydantic:** Checks whether incoming data follows the expected schema.
- **SQLAlchemy:** Executes database operations.
- **PostgreSQL:** Stores and retrieves persistent data.
- **JWT:** Allows the backend to identify authenticated users through protected requests.

---

## 3. Understanding the API Request-Response Cycle

An API request-response cycle describes the complete process of communication between a client and a server.

### Basic Flow

```text
       USER
         |
         v
   React Frontend
         |
         | HTTP Request
         v
    FastAPI Backend
         |
         | Validate Request
         v
    Business Logic
         |
         | Database Query
         v
      SQLAlchemy
         |
         v
     PostgreSQL
         |
         | Database Result
         v
      SQLAlchemy
         |
         v
    FastAPI Backend
         |
         | JSON Response
         v
   React Frontend
         |
         v
   Update User Interface
```

### Step-by-Step Explanation

**Step 1: User Interaction**

The user performs an action in the frontend.

Example: The user fills out an expense form and clicks the Add Expense button.

**Step 2: Frontend Sends an API Request**

React collects the form data and sends it to the backend using an HTTP method.

Example:

```http
POST /api/transactions
```

Request body:

```json
{
  "title": "Lunch",
  "amount": 250,
  "kind": "expense",
  "category_id": 1,
  "transaction_date": "2026-11-18",
  "note": "Lunch with friends"
}
```

**Step 3: Backend Receives the Request**

FastAPI receives the HTTP request through the corresponding API endpoint.

Example:

```python
@router.post("/transactions")
def create_transaction(data: TransactionCreate):
    # Process transaction
    pass
```

**Step 4: Request Validation**

FastAPI uses the Pydantic schema to validate incoming data.

For example:

- Title must not be empty.
- Amount must be greater than zero.
- Category ID must be an integer.
- Transaction date must follow the expected date format.

If validation fails, FastAPI returns a validation error instead of proceeding with the endpoint logic.

**Step 5: Execute Business Logic**

After validation, the backend performs the required operations.

Examples:

- Identify the authenticated user.
- Check the requested category.
- Prepare the transaction record.
- Apply application-specific rules.

**Step 6: Database Interaction**

The backend uses SQLAlchemy to communicate with PostgreSQL.

Example:

```python
db.add(transaction)
db.commit()
db.refresh(transaction)
```

Explanation:

- `db.add()` adds the new object to the database session.
- `db.commit()` saves the transaction to the database.
- `db.refresh()` retrieves updated database values for the object.

**Step 7: Backend Returns a Response**

After successfully creating the transaction, the backend returns the result as JSON.

Example:

```json
{
  "id": 10,
  "title": "Lunch",
  "amount": "250.00",
  "kind": "expense",
  "category_id": 1,
  "category": {
    "id": 1,
    "name": "Food",
    "kind": "expense"
  },
  "transaction_date": "2026-11-18",
  "note": "Lunch with friends"
}
```

**Step 8: Frontend Updates the UI**

React receives the response and updates the application interface.

For example:

- The new transaction appears in the transaction list.
- The dashboard can refresh its summary.
- A success message can be displayed.

---

## 4. Understanding HTTP Methods in API Flow

HTTP methods define the type of operation the client wants the backend to perform.

| HTTP Method | Purpose       | ExpenseTracker Example |
| ----------- | ------------- | ---------------------- |
| GET         | Retrieve data | Fetch transactions     |
| POST        | Create data   | Add a transaction      |
| PUT         | Update data   | Edit a transaction     |
| DELETE      | Delete data   | Remove a transaction   |

### Examples

**GET Request**

```http
GET /api/transactions
```

Retrieves the user's transactions.

**POST Request**

```http
POST /api/transactions
```

Creates a new transaction.

**PUT Request**

```http
PUT /api/transactions/10
```

Updates transaction with ID 10.

**DELETE Request**

```http
DELETE /api/transactions/10
```

Deletes transaction with ID 10.

---

## 5. Understanding API Authentication Flow

ExpenseTracker uses Google Sign-In and JWT authentication.

### Authentication Process

```text
User
 |
 v
React Frontend
 |
 | Google Sign-In
 v
Google Identity Services
 |
 | Google ID Token
 v
React Frontend
 |
 | POST /api/auth/google
 v
FastAPI Backend
 |
 | Verify Google Credential
 v
Create / Retrieve User
 |
 | Generate Application JWT
 v
Return Access Token
 |
 v
React Frontend
 |
 | Store / use access token
 v
Protected API Requests
 |
 | Authorization: Bearer <token>
 v
FastAPI Backend
 |
 | Verify JWT
 v
Access Protected Resources
```

### Important Explanation

There are two different tokens involved:

**Google ID Token**

- Issued by Google after successful Google Sign-In.
- Sent to the backend.
- Verified by the backend to establish the user's identity.

**Application JWT**

- Generated by the ExpenseTracker backend.
- Returned to the frontend after successful authentication.
- Sent with subsequent protected API requests.

Example authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

The backend verifies this token before allowing access to protected resources.

---

## 6. API Flow in ExpenseTracker

Let's understand how different features communicate with the backend.

### A. Login Flow

```text
User clicks Google Sign-In
        |
        v
Google authentication
        |
        v
Google ID Token received
        |
        v
POST /api/auth/google
        |
        v
Backend verifies credential
        |
        v
Application JWT returned
        |
        v
User authenticated
```

### B. Fetch Transactions Flow

```text
User opens Transactions page
        |
        v
React sends GET request
        |
        v
GET /api/transactions
        |
        v
FastAPI verifies JWT
        |
        v
Backend retrieves user transactions
        |
        v
SQLAlchemy queries PostgreSQL
        |
        v
JSON response returned
        |
        v
React displays transactions
```

### C. Create Transaction Flow

```text
User fills expense form
        |
        v
React collects form data
        |
        v
POST /api/transactions
        |
        v
FastAPI validates request
        |
        v
Backend processes transaction
        |
        v
SQLAlchemy saves transaction
        |
        v
PostgreSQL stores record
        |
        v
API returns created transaction
        |
        v
React updates transaction list
```

### D. Delete Transaction Flow

```text
User clicks Delete
        |
        v
React sends DELETE request
        |
        v
DELETE /api/transactions/{id}
        |
        v
FastAPI verifies request
        |
        v
Backend identifies transaction
        |
        v
SQLAlchemy deletes record
        |
        v
PostgreSQL updates database
        |
        v
API returns response
        |
        v
React updates the interface
```

---

## 7. Understanding API Status Codes

HTTP status codes indicate the result of an API request.

| Status Code | Meaning               | Example                                        |
| ----------- | --------------------- | ---------------------------------------------- |
| 200         | OK                    | Data retrieved successfully                    |
| 201         | Created               | Transaction created                            |
| 400         | Bad Request           | Invalid request according to application rules |
| 401         | Unauthorized          | Missing or invalid authentication              |
| 403         | Forbidden             | User is not allowed to perform an operation    |
| 404         | Not Found             | Requested resource does not exist              |
| 422         | Unprocessable Entity  | Request validation failed                      |
| 500         | Internal Server Error | Unexpected backend error                       |

Note: The exact status codes returned depend on the backend implementation.

---

## 8. Error Handling in API Flow

Errors can occur at different stages of API communication.

### Frontend Errors

Examples:

- Network connection failure.
- Backend server unavailable.
- Unexpected response format.

### Backend Errors

Examples:

- Invalid request data.
- Authentication failure.
- Missing database record.
- Database connection error.

### Database Errors

Examples:

- Database server unavailable.
- Constraint violation.
- Failed database transaction.

### Example Frontend Error Handling

```javascript
try {
  const response = await api.post("/transactions", formData);

  console.log("Transaction created:", response.data);
} catch (error) {
  console.error("API Error:", error);

  if (error.response) {
    console.log("Server response:", error.response.data);
  } else {
    console.log("Network or connection error");
  }
}
```

The exact error-handling approach depends on whether the project uses Axios or Fetch.

---

## 9. Important API Flow Concepts

| Concept        | Meaning                                                   |
| -------------- | --------------------------------------------------------- |
| Client         | Application that sends requests                           |
| Server         | Application that processes requests                       |
| Endpoint       | URL where an API operation is available                   |
| Request        | Data or instructions sent to the server                   |
| Response       | Data returned by the server                               |
| HTTP Method    | Defines the requested operation                           |
| JSON           | Common data format for API communication                  |
| Validation     | Checks whether incoming data is valid                     |
| Authentication | Verifies the user's identity                              |
| Authorization  | Determines what the user is allowed to access             |
| ORM            | Maps application objects to database records              |
| Middleware     | Processes requests or responses around endpoint execution |

---

## 10. Why Understanding API Flow Is Important

Understanding API flow helps developers:

1. Debug frontend and backend communication problems.
2. Understand where data validation happens.
3. Identify whether an issue comes from React, FastAPI, or PostgreSQL.
4. Design better API endpoints.
5. Implement authentication and authorization correctly.
6. Understand database operations.
7. Handle errors effectively.
8. Explain the architecture of a full-stack application.

---

## 11. Practical Exercise

Try explaining the following workflows without looking at this document.

### Exercise 1: Create Transaction

Explain what happens when a user adds a new expense.

Your explanation should include:

- React form
- HTTP POST request
- FastAPI endpoint
- Pydantic validation
- Business logic
- SQLAlchemy
- PostgreSQL
- JSON response
- React UI update

### Exercise 2: Fetch Transactions

Explain how the dashboard or transactions page retrieves data from the backend.

### Exercise 3: Authentication

Explain the difference between a Google ID token and an application JWT.

### Exercise 4: Error Handling

What happens when a user submits an expense with an invalid amount?

---

## 12. Interview Questions

**Q1. What is API flow?**

API flow is the process through which a client sends a request to a server, the server processes it, interacts with the database if required, and returns a response.

**Q2. What happens when React sends a request to FastAPI?**

FastAPI receives the request, validates its input, executes the endpoint logic, interacts with the database when necessary, and returns a response.

**Q3. What is the role of Pydantic?**

Pydantic validates and structures data according to defined schemas.

**Q4. What is the role of SQLAlchemy?**

SQLAlchemy is an ORM that allows Python applications to interact with relational databases using Python objects and SQL expressions.

**Q5. What is the difference between authentication and authorization?**

Authentication verifies who the user is. Authorization determines what the authenticated user is allowed to access.

**Q6. What is a JSON response?**

A JSON response is structured data returned by an API using the JSON format.

**Q7. What happens if API validation fails?**

FastAPI returns a validation error response, commonly HTTP 422, and the endpoint's normal processing does not proceed.

**Q8. Why do we use JWT?**

JWT allows the backend to verify the identity represented by a token on subsequent protected requests.

---

## 13. Summary

API flow explains how different components of a full-stack application communicate.

In ExpenseTracker:

- React collects user input and displays information.
- HTTP requests transfer data to FastAPI.
- FastAPI validates requests and executes application logic.
- SQLAlchemy communicates with PostgreSQL.
- PostgreSQL stores and retrieves application data.
- FastAPI returns JSON responses.
- React uses those responses to update the interface.
- JWT protects authenticated API operations.

**Remember:** API flow is not just about sending a request. It includes the complete journey of data from the frontend to the backend, through the database when needed, and back to the frontend.
