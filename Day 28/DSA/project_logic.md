# Project Logic – SmartSpend ExpenseTracker

## 1. What Is Project Logic?

Project logic describes how an application works internally to achieve its purpose.

It explains:

- What happens when a user performs an action.
- How information moves between different components.
- How the frontend communicates with the backend.
- How the backend processes user requests.
- How information is stored and retrieved from the database.
- How the application produces the expected result.

In simple terms:

**Project logic explains how the application works, not just how it looks.**

For example, when a user adds an expense, the application must:

1. Collect expense information.
2. Validate the information.
3. Send it to the backend.
4. Verify the user's authentication.
5. Save the expense in PostgreSQL.
6. Return the result to the frontend.
7. Update the user interface.

This entire sequence is part of the project logic.

---

## 2. Project Overview

SmartSpend is a web-based personal expense tracker designed to help users manage their daily expenses through a simple interface.

### Technology Stack

| Layer          | Technology     | Responsibility                     |
| -------------- | -------------- | ---------------------------------- |
| Frontend       | React.js       | User interface and interactions    |
| Styling        | Tailwind CSS   | Responsive UI design               |
| Backend        | FastAPI        | API endpoints and business logic   |
| Database       | PostgreSQL     | Persistent data storage            |
| ORM            | SQLAlchemy     | Database operations                |
| Authentication | Google Sign-In | User identity verification         |
| Authorization  | JWT            | Protecting authenticated endpoints |

### Main Features

1. Google Sign-In.
2. User-specific expense management.
3. Transaction creation.
4. Transaction listing.
5. Transaction updating.
6. Transaction deletion.
7. Expense categories.
8. Monthly budgets.
9. Dashboard summaries.
10. Basic spending insights.

---

## 3. High-Level Project Architecture

The application follows a client-server architecture.

The frontend handles user interactions, the backend processes requests, and the database stores application information.

```text
                 USER
                   |
                   v
          React Frontend
                   |
                   |
             HTTP Requests
                   |
                   v
             FastAPI Backend
                   |
          ---------------------
          |         |         |
          v         v         v
       Routes    Business   Validation
                  Logic
          |         |         |
          ---------------------
                   |
                   v
             SQLAlchemy ORM
                   |
                   v
              PostgreSQL
                   |
                   v
              API Response
                   |
                   v
             React Frontend
                   |
                   v
             Updated UI
```

### Responsibility of Each Layer

**Frontend**

- Displays the application interface.
- Collects user input.
- Handles form interactions.
- Sends API requests.
- Displays loading, success, and error states.
- Updates the interface using returned data.

**Backend**

- Receives HTTP requests.
- Verifies authentication.
- Validates incoming information.
- Executes application logic.
- Communicates with the database.
- Returns JSON responses.

**Database**

- Stores user information.
- Stores transactions.
- Stores categories.
- Stores monthly budgets.
- Maintains relationships between records.

---

## 4. Authentication Logic – Google Sign-In

Authentication allows users to access their own accounts.

SmartSpend uses Google Sign-In for user identity verification and JWT for application authentication.

### Authentication Flow

```text
User
 |
 v
Clicks Google Sign-In
 |
 v
Google Authentication
 |
 v
Google Returns ID Token
 |
 v
React Frontend
 |
 | Sends ID token
 v
FastAPI Backend
 |
 v
Verifies Google ID Token
 |
 v
Finds or Creates User
 |
 v
Generates Application JWT
 |
 v
Returns JWT to Frontend
 |
 v
Frontend Uses JWT
 |
 v
Accesses Protected APIs
```

### Step-by-Step Explanation

**Step 1: User initiates login**

The user clicks the Google Sign-In button.

**Step 2: Google verifies identity**

Google handles the authentication process and provides an ID token to the frontend.

**Step 3: Frontend sends the token**

The frontend sends the Google ID token to the backend.

Example:

```http
POST /api/auth/google
Content-Type: application/json
```

**Step 4: Backend verifies the token**

FastAPI verifies the Google ID token to confirm that it is valid and intended for the application.

**Step 5: User lookup**

The backend checks whether the user already exists in the PostgreSQL database.

- If the user exists, the existing account is used.
- If the user does not exist, a new user record is created.

**Step 6: Application JWT generation**

The backend generates its own JWT and returns it to the frontend.

**Step 7: Access protected APIs**

The frontend includes the application JWT in the Authorization header when calling protected endpoints.

Example:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Important Difference

| Google ID Token                     | Application JWT                           |
| ----------------------------------- | ----------------------------------------- |
| Issued by Google                    | Issued by our backend                     |
| Verifies Google identity            | Authenticates requests to our application |
| Sent to backend during Google login | Sent with protected API requests          |

Google authentication and application authorization are related but different processes.

---

## 5. Transaction Management Logic

Transaction management is one of the central features of SmartSpend.

It allows users to create, view, update, and delete their expenses.

These operations are known as CRUD:

- Create
- Read
- Update
- Delete

### 5.1 Create Transaction

Suppose a user spends ₹500 on groceries.

The user opens the transaction form and enters:

```json
{
  "title": "Groceries",
  "amount": 500,
  "type": "expense",
  "category_id": 1,
  "date": "2026-11-18"
}
```

The application processes this information.

**Flow:**

```text
User
 |
 v
Transaction Form
 |
 v
Enter Transaction Details
 |
 v
Frontend Validation
 |
 v
POST /api/transactions
 |
 v
FastAPI
 |
 v
JWT Authentication
 |
 v
Request Validation
 |
 v
Business Logic
 |
 v
SQLAlchemy
 |
 v
PostgreSQL
 |
 v
Transaction Saved
 |
 v
JSON Response
 |
 v
Frontend Updates Transaction List
```

**Important operations:**

1. Collect transaction details.
2. Validate required fields.
3. Send the request to FastAPI.
4. Authenticate the request.
5. Validate the request data.
6. Associate the transaction with the authenticated user.
7. Save the transaction in PostgreSQL.
8. Return the created transaction.
9. Update the frontend.

### 5.2 Read Transactions

When a user opens the transaction page, the frontend requests the user's transactions.

Example:

```http
GET /api/transactions
```

The backend:

1. Verifies the user's JWT.
2. Identifies the authenticated user.
3. Retrieves that user's transactions.
4. Converts the results into a JSON response.
5. Sends the response to React.

The frontend displays the transactions.

**Important:** Transaction queries must be scoped to the authenticated user so that one user cannot access another user's private financial records.

### 5.3 Update Transaction

Suppose the user entered ₹500 but the actual expense was ₹600.

The user edits the transaction.

Example:

```http
PUT /api/transactions/1
```

The backend:

1. Verifies authentication.
2. Finds the requested transaction.
3. Checks that the transaction belongs to the authenticated user.
4. Validates the updated information.
5. Updates the database record.
6. Returns the updated transaction.

### 5.4 Delete Transaction

Suppose the user wants to remove an incorrect transaction.

Example:

```http
DELETE /api/transactions/1
```

The backend:

1. Verifies authentication.
2. Finds the transaction.
3. Checks ownership.
4. Deletes the record.
5. Returns an appropriate response.

The frontend then removes the transaction from its displayed list or refreshes the data.

---

## 6. Category Management Logic

Categories help users organize their transactions.

Examples:

- Food
- Shopping
- Transportation
- Entertainment
- Healthcare
- Education
- Bills

### How It Works

1. The application retrieves available categories.
2. The frontend displays them in a selection field.
3. The user selects a category while creating a transaction.
4. The selected category ID is sent to the backend.
5. The backend validates the category.
6. The transaction is associated with that category in the database.

### Example

```text
Transaction
 |
 | category_id = 1
 v
Category Table
 |
 | id = 1
 v
Food
```

Using category IDs and database relationships avoids repeatedly storing category information as unstructured text in every transaction.

---

## 7. Monthly Budget Management Logic

The budget feature allows users to define spending limits for categories.

For example:

| Category       | Monthly Budget |
| -------------- | -------------: |
| Food           |         ₹5,000 |
| Shopping       |         ₹3,000 |
| Transportation |         ₹2,000 |

### Budget Logic

Suppose the user sets a monthly food budget of ₹5,000.

During the month, the user records:

- Lunch: ₹200
- Groceries: ₹800
- Dinner: ₹300

Total spending:

```text
200 + 800 + 300 = 1300
```

Remaining budget:

```text
Budget - Actual Spending

5000 - 1300 = 3700
```

Budget utilization:

```text
(Actual Spending / Budget) * 100

(1300 / 5000) * 100 = 26%
```

### Budget Flow

```text
User Sets Monthly Budget
          |
          v
Frontend Sends Budget
          |
          v
FastAPI Validates Request
          |
          v
Budget Saved in PostgreSQL
          |
          v
User Adds Transactions
          |
          v
Backend Retrieves Relevant Spending
          |
          v
Calculates Budget Usage
          |
          v
Returns Budget Information
          |
          v
Frontend Displays Budget Progress
```

**Note:** These calculations illustrate the intended budget logic. The exact calculation, filtering, and update behavior should be verified against the current backend implementation.

---

## 8. Dashboard Logic

The dashboard provides a summarized view of the user's financial activity.

Instead of displaying every transaction individually, it presents useful information.

Examples:

- Total income.
- Total expenses.
- Available balance.
- Monthly spending.
- Category-wise spending.
- Budget progress.

### Example Data

Suppose the user has recorded:

| Transaction | Type    |  Amount |
| ----------- | ------- | ------: |
| Salary      | Income  | ₹25,000 |
| Groceries   | Expense |  ₹2,000 |
| Travel      | Expense |  ₹1,000 |
| Shopping    | Expense |  ₹3,000 |

### Total Income

```text
Total Income = 25000
```

### Total Expenses

```text
Total Expenses = 2000 + 1000 + 3000

Total Expenses = 6000
```

### Available Balance

```text
Balance = Total Income - Total Expenses

Balance = 25000 - 6000

Balance = ₹19000
```

### Dashboard Processing Flow

```text
User Opens Dashboard
        |
        v
Frontend Requests Dashboard Data
        |
        v
GET /api/dashboard
        |
        v
FastAPI Authenticates User
        |
        v
Retrieves Relevant Financial Data
        |
        v
Processes Summary Information
        |
        v
Returns JSON Response
        |
        v
React Updates Dashboard
        |
        v
User Sees Financial Summary
```

**Important:** The calculations above explain the general financial logic. The exact dashboard response fields and calculation rules should be checked against the backend implementation.

---

## 9. Frontend and Backend Communication

React and FastAPI communicate through HTTP APIs.

The frontend does not directly access PostgreSQL.

Instead, it sends requests to the backend.

### Example: Fetch Transactions

```text
React Component
      |
      v
API Function
      |
      v
HTTP GET Request
      |
      v
FastAPI Endpoint
      |
      v
Authentication
      |
      v
Database Query
      |
      v
PostgreSQL
      |
      v
SQLAlchemy Results
      |
      v
JSON Response
      |
      v
React State Update
      |
      v
Updated UI
```

### Common HTTP Methods

| Method | Purpose              | Example            |
| ------ | -------------------- | ------------------ |
| GET    | Retrieve information | Get transactions   |
| POST   | Create information   | Add transaction    |
| PUT    | Update information   | Edit transaction   |
| DELETE | Remove information   | Delete transaction |

### Why Use an API?

- Separates frontend and backend responsibilities.
- Allows different clients to use the same backend.
- Provides a controlled way to access database operations.
- Supports authentication and validation.
- Makes the application easier to maintain.

---

## 10. Validation and Error Handling Logic

Validation ensures that the application receives acceptable information.

For example, a transaction should not be saved with an invalid amount.

### Frontend Validation

The frontend can check:

- Required fields.
- Empty input.
- Invalid amount.
- Missing category.
- Invalid date.

### Backend Validation

The backend must independently validate incoming data.

For example:

- Required fields must be present.
- Amount must follow the expected data type and constraints.
- Category must be valid.
- The user must be authenticated.
- The requested transaction must belong to the user.

Frontend validation improves user experience, but backend validation is essential for security and data integrity.

### Error Handling Flow

```text
User Performs Action
        |
        v
Frontend Sends Request
        |
        v
Backend Processes Request
        |
        v
       Error?
       /    \
     Yes     No
      |       |
      v       v
Error       Success
Response    Response
      |       |
      v       v
Frontend Handles Result
      |
      v
Displays Message or Updated Data
```

Examples of HTTP status codes:

| Status Code | Meaning                            |
| ----------- | ---------------------------------- |
| 200         | Request successful                 |
| 201         | Resource created                   |
| 400         | Bad request                        |
| 401         | Authentication required or invalid |
| 403         | Access forbidden                   |
| 404         | Resource not found                 |
| 422         | Request validation failed          |
| 500         | Internal server error              |

---

## 11. Complete Project Workflow

The following diagram summarizes how the major parts of SmartSpend work together.

```text
                    USER
                      |
                      v
                Google Sign-In
                      |
                      v
               Backend Verification
                      |
                      v
                Application JWT
                      |
                      v
                React Dashboard
                      |
          ---------------------------
          |            |            |
          v            v            v
     Transactions   Budgets     Categories
          |            |            |
          v            v            v
      FastAPI       FastAPI       FastAPI
          |            |            |
          ---------------------------
                      |
                      v
                  SQLAlchemy
                      |
                      v
                  PostgreSQL
                      |
                      v
                API Responses
                      |
                      v
                 React State
                      |
                      v
                Updated Interface
```

---

## 12. Future Enhancements

The following features are part of the longer-term product direction, not the current implemented functionality.

### Telegram Integration

The planned Telegram integration would allow users to send messages such as:

```text
Spent 200 on lunch
```

The bot would:

1. Receive the message.
2. Parse the expense details.
3. Identify the amount and category.
4. Validate the extracted information.
5. Save the transaction through the backend.
6. Send a confirmation message.

### Telegram Analytics and Alerts

The bot could also:

- Send daily or monthly expense summaries.
- Notify users about budget limits.
- Provide spending tips.
- Show category-wise spending.

### Gmail Integration

A possible future Gmail integration could identify relevant transaction notifications and help users record expenses automatically.

These features would require additional authentication, privacy controls, validation, and user consent.

---

## 13. Important Concepts Used in Project Logic

| Concept          | Purpose                                |
| ---------------- | -------------------------------------- |
| Authentication   | Verifies user identity                 |
| Authorization    | Controls access to resources           |
| CRUD             | Manages transaction records            |
| REST API         | Connects frontend and backend          |
| JSON             | Transfers structured information       |
| Pydantic         | Validates request and response data    |
| SQLAlchemy       | Communicates with the database         |
| PostgreSQL       | Stores persistent information          |
| JWT              | Authenticates application API requests |
| State Management | Keeps frontend data synchronized       |
| Business Logic   | Implements application rules           |
| Error Handling   | Manages unsuccessful operations        |

---

## 14. How to Explain Project Logic in an Interview

**Question: Explain the working logic of your ExpenseTracker project.**

Suggested answer:

"SmartSpend is a full-stack expense-tracking application developed using React, FastAPI, and PostgreSQL.

The application starts with Google Sign-In. When a user authenticates through Google, the frontend sends the Google ID token to the FastAPI backend. The backend verifies the token, identifies or creates the user, and generates an application JWT.

After authentication, the user can access the dashboard and manage transactions.

When a user creates a transaction, React collects the information and sends a POST request to the backend. FastAPI authenticates the request, validates the data, associates it with the current user, and stores it in PostgreSQL using SQLAlchemy.

The backend returns a JSON response, and React updates the interface.

The same general process is used for retrieving, updating, and deleting transactions.

The application also supports categories, monthly budgets, and dashboard summaries. These features help users organize expenses and understand their spending.

My main goal is to keep the user interface simple while handling the application logic and data processing in the background."

---

## 15. Questions to Test Your Understanding

Try answering these questions without looking at the explanations above.

1. What happens when a user clicks Google Sign-In?
2. What is the difference between a Google ID token and an application JWT?
3. Why does the frontend communicate with FastAPI instead of directly accessing PostgreSQL?
4. What happens when a user adds a new transaction?
5. How does the backend identify which user owns a transaction?
6. What is CRUD?
7. Why do we need transaction categories?
8. How can we calculate the remaining monthly budget?
9. How does the dashboard obtain its financial summary?
10. What happens when an API request fails?
11. What is the responsibility of SQLAlchemy?
12. What is the difference between component communication and API communication?

---

## 16. Final Summary

Project logic describes how different parts of an application work together.

In SmartSpend:

- React handles the user interface.
- Google Sign-In verifies user identity.
- FastAPI handles API requests and application logic.
- JWT protects authenticated API endpoints.
- Pydantic validates incoming data.
- SQLAlchemy handles database operations.
- PostgreSQL stores application data.
- React displays the returned information.

**The main idea:**

User Action → Frontend → API Request → Backend Logic → Database → API Response → Frontend Update.

Understanding this complete flow helps you explain, debug, maintain, and improve your application.
