# Project Architecture – SmartSpend ExpenseTracker

## 1. What Is Project Architecture?

Project architecture describes the overall structure and organization of a software application.

It defines:

- What major components an application contains.
- What responsibilities each component has.
- How different components communicate.
- How data moves through the application.
- How the frontend, backend, and database work together.
- How the application can be maintained and extended.

In simple words:

**Project architecture is the blueprint of a software application.**

Just as a building needs a blueprint before construction, a software application needs an architecture to organize its components and responsibilities.

For example, in SmartSpend:

- React handles the user interface.
- FastAPI handles API requests and business logic.
- PostgreSQL stores application data.
- SQLAlchemy connects the backend with the database.
- Google Sign-In verifies user identity.
- JWT protects authenticated API requests.

All these parts work together to make the application function.

---

## 2. Why Is Project Architecture Important?

Without proper architecture, all application logic can become mixed together.

For example, imagine putting:

- Authentication logic.
- Transaction operations.
- Budget calculations.
- Database queries.
- API endpoints.

Inside one large file.

Initially, the application might work, but maintaining it becomes difficult as new features are added.

Good architecture helps us:

1. Organize application code.
2. Separate responsibilities.
3. Reduce unnecessary dependencies.
4. Make debugging easier.
5. Improve code reusability.
6. Support future development.
7. Make testing easier.
8. Prepare the application for growth.

---

## 3. SmartSpend Technology Architecture

SmartSpend follows a client-server architecture with separate frontend, backend, and database layers.

### Technology Stack

| Layer          | Technology     | Responsibility                  |
| -------------- | -------------- | ------------------------------- |
| Frontend       | React.js       | User interface                  |
| Build Tool     | Vite           | Frontend development and build  |
| Styling        | Tailwind CSS   | UI styling                      |
| Backend        | FastAPI        | API development                 |
| Language       | Python         | Backend programming             |
| Validation     | Pydantic       | Request and response validation |
| ORM            | SQLAlchemy     | Database operations             |
| Database       | PostgreSQL     | Persistent data storage         |
| Authentication | Google Sign-In | User identity verification      |
| Authorization  | JWT            | Authenticated API access        |

---

## 4. High-Level Architecture Diagram

The following diagram shows how the main parts of SmartSpend communicate.

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
          -----------------------
          |          |          |
          v          v          v
       Routers   Validation  Security
          |          |          |
          -----------------------
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
              JSON Response
                    |
                    v
             React Frontend
                    |
                    v
              Updated UI
```

### How It Works

1. The user interacts with the React frontend.
2. React sends an HTTP request to FastAPI.
3. FastAPI receives and processes the request.
4. Authentication and validation are performed where required.
5. Business logic determines what operation needs to happen.
6. SQLAlchemy performs the required database operations.
7. PostgreSQL stores or retrieves the information.
8. FastAPI returns a JSON response.
9. React updates the user interface.

**Important:** React does not directly communicate with PostgreSQL. All database operations are handled through the backend.

---

## 5. Frontend Architecture

The frontend is developed using React.

Its main responsibility is to provide an interface through which users interact with SmartSpend.

### Frontend Responsibilities

- Display login and dashboard pages.
- Collect transaction information.
- Display transaction records.
- Show monthly budgets.
- Display financial summaries.
- Handle user interactions.
- Communicate with backend APIs.
- Manage loading and error states.

### Example Frontend Structure

A possible organized frontend structure:

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TransactionCard.jsx
│   │   └── SummaryCard.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   └── Budgets.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── package.json
└── vite.config.js
```

This is an illustrative structure. The actual folders and files depend on the current implementation.

### Why Component-Based Architecture?

React allows us to divide the user interface into reusable components.

For example:

```text
Dashboard
   |
   |------ Header
   |
   |------ SummaryCards
   |
   |------ BudgetOverview
   |
   |------ TransactionList
                 |
                 |------ TransactionCard
```

Each component handles a specific part of the interface.

Benefits:

- Reusability.
- Easier maintenance.
- Better organization.
- Easier debugging.
- Independent UI development.

---

## 6. Backend Architecture

The backend is developed using FastAPI.

Its responsibility is to process requests from the frontend and execute application logic.

### Backend Responsibilities

- Authentication.
- Authorization.
- API routing.
- Request validation.
- Business logic.
- Database operations.
- Error handling.
- JSON responses.

### Example Backend Structure

```text
backend/
│
├── app/
│   │
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── transactions.py
│   │   ├── budgets.py
│   │   └── categories.py
│   │
│   ├── core/
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   └── services/
│       ├── transaction_service.py
│       └── budget_service.py
│
├── requirements.txt
└── .env
```

This is an example of a modular backend structure.

### Responsibility of Important Files

| File        | Responsibility                        |
| ----------- | ------------------------------------- |
| main.py     | Initializes the FastAPI application   |
| config.py   | Application configuration             |
| database.py | Database connection and session setup |
| models.py   | SQLAlchemy database models            |
| schemas.py  | Pydantic validation schemas           |
| routers/    | API endpoint definitions              |
| core/       | Security and shared dependencies      |
| services/   | Application and business logic        |

The exact implementation may organize some of these responsibilities differently.

---

## 7. Database Architecture

SmartSpend uses PostgreSQL to store application data.

The database contains tables representing different entities.

### Main Tables

| Table        | Purpose                           |
| ------------ | --------------------------------- |
| users        | Stores user information           |
| transactions | Stores income and expense records |
| categories   | Stores transaction categories     |
| budgets      | Stores monthly budget information |

### Simplified Database Relationships

```text
              USERS
                |
                |
         One User Has Many
                |
                v
          TRANSACTIONS
                |
                |
         References Category
                |
                v
           CATEGORIES


              USERS
                |
                |
         One User Has Many
                |
                v
             BUDGETS
```

### Example

Suppose a user records an expense:

```json
{
  "title": "Groceries",
  "amount": 500,
  "type": "expense",
  "category_id": 1
}
```

The database stores the transaction along with its user relationship and category reference.

### Why PostgreSQL?

- Relational database management.
- Supports relationships between tables.
- Provides transactions and data integrity.
- Supports indexing.
- Handles structured financial records.
- Supports complex queries and aggregations.

---

## 8. API Architecture

An API acts as a communication bridge between the frontend and backend.

SmartSpend uses HTTP APIs developed with FastAPI.

### Example API Endpoints

| Method | Endpoint                           | Purpose                    |
| ------ | ---------------------------------- | -------------------------- |
| POST   | /api/auth/google                   | Google authentication      |
| GET    | /api/auth/me                       | Get authenticated user     |
| GET    | /api/transactions                  | Retrieve transactions      |
| POST   | /api/transactions                  | Create transaction         |
| PUT    | /api/transactions/{transaction_id} | Update transaction         |
| DELETE | /api/transactions/{transaction_id} | Delete transaction         |
| GET    | /api/budgets                       | Retrieve budgets           |
| POST   | /api/budgets                       | Create budget              |
| GET    | /api/categories                    | Retrieve categories        |
| GET    | /api/dashboard                     | Retrieve dashboard summary |
| GET    | /health                            | Health check               |

The exact methods and endpoint paths should match the current API implementation.

### API Communication Flow

```text
React Component
      |
      v
API Service Function
      |
      v
HTTP Request
      |
      v
FastAPI Router
      |
      v
Authentication / Validation
      |
      v
Business Logic
      |
      v
Database Operation
      |
      v
JSON Response
      |
      v
React Component
```

### Why Separate API Logic?

Keeping API communication in a separate service layer can help:

- Avoid repeated request code.
- Centralize API configuration.
- Handle authentication headers consistently.
- Make error handling easier.
- Keep UI components cleaner.

---

## 9. Authentication Architecture

SmartSpend uses two different tokens for different purposes.

### Google ID Token

Google issues an ID token after successful Google authentication.

The frontend sends this token to the backend.

### Application JWT

After verifying the Google ID token, the backend generates its own JWT.

The frontend uses this JWT when requesting protected resources.

### Authentication Flow

```text
User
 |
 v
Google Sign-In
 |
 v
Google ID Token
 |
 v
React Frontend
 |
 v
FastAPI Backend
 |
 v
Verify Google Token
 |
 v
Find or Create User
 |
 v
Generate Application JWT
 |
 v
Return JWT
 |
 v
Frontend Uses JWT
 |
 v
Protected API Requests
```

### Why Separate Authentication and Authorization?

Authentication answers:

"Who are you?"

Authorization answers:

"What are you allowed to access?"

For example, a user may be authenticated successfully but should only be able to access their own transactions.

The backend must enforce this ownership check.

---

## 10. Application Logic Architecture

Business logic contains the rules that define how the application behaves.

For SmartSpend, examples include:

- Creating a transaction.
- Calculating total expenses.
- Calculating available balance.
- Tracking budget usage.
- Filtering transactions.
- Generating dashboard summaries.

### Example: Transaction Creation

```text
User Enters Expense
        |
        v
Frontend Validates Input
        |
        v
POST API Request
        |
        v
FastAPI Receives Request
        |
        v
Authenticate User
        |
        v
Validate Transaction Data
        |
        v
Execute Business Logic
        |
        v
Save Using SQLAlchemy
        |
        v
PostgreSQL Stores Record
        |
        v
Return JSON Response
        |
        v
React Updates UI
```

Separating business logic from API route definitions can make the backend easier to test and maintain.

---

## 11. Architecture Pattern Used in SmartSpend

SmartSpend can be organized as a **modular monolithic application**.

### What Is a Monolithic Application?

A monolithic application is deployed as one main application rather than being divided into independently deployed services.

It can still contain multiple organized modules.

For example:

- Authentication module.
- Transaction module.
- Budget module.
- Category module.
- Dashboard module.

### What Is a Modular Monolith?

A modular monolith keeps application functionality in one deployable backend while separating different responsibilities into modules.

```text
              FastAPI Application
                      |
       --------------------------------
       |          |         |         |
       v          v         v         v
      Auth   Transactions Budgets  Categories
       |          |         |         |
       --------------------------------
                      |
                      v
                  PostgreSQL
```

### Why Is It Suitable?

- Easier to develop initially.
- Easier to deploy than multiple services.
- Less infrastructure complexity.
- Modules can be maintained separately.
- Suitable for an MVP and growing application.

Microservices are not necessary just because an application has multiple features.

---

## 12. Complete Request Lifecycle

Let's understand what happens when a user opens the transaction page.

### Step-by-Step Flow

**Step 1: User action**

The user opens the Transactions page.

**Step 2: React component**

The Transactions component loads and requests transaction data.

**Step 3: API service**

The frontend API service sends a GET request to FastAPI.

**Step 4: Authentication**

FastAPI verifies the application JWT.

**Step 5: User identification**

The backend identifies the authenticated user.

**Step 6: Database query**

SQLAlchemy retrieves the transactions belonging to that user.

**Step 7: JSON serialization**

The backend converts the retrieved information into a JSON-compatible response.

**Step 8: Frontend receives response**

React receives the response and updates its state.

**Step 9: UI rendering**

The transaction list displays the retrieved records.

### Complete Flow

```text
User
 |
 v
Transactions Page
 |
 v
React Component
 |
 v
API Service
 |
 v
GET /api/transactions
 |
 v
FastAPI Router
 |
 v
JWT Verification
 |
 v
Identify Current User
 |
 v
SQLAlchemy Query
 |
 v
PostgreSQL
 |
 v
JSON Response
 |
 v
React State Update
 |
 v
Display Transactions
```

---

## 13. How Can the Architecture Grow?

The current architecture can be extended gradually as the application develops.

### Current Architecture

```text
React
  |
  v
FastAPI
  |
  v
PostgreSQL
```

### Possible Future Architecture

```text
                  Users
                    |
                    v
              React Frontend
                    |
                    v
                FastAPI
                    |
        -------------------------
        |          |            |
        v          v            v
    Auth APIs  Expense APIs  Budget APIs
        |          |            |
        -------------------------
                    |
                    v
                PostgreSQL
                    |
        -------------------------
        |                       |
        v                       v
   Background Workers       Redis Cache
        |
        v
   Telegram Bot / Notifications
```

Possible future improvements:

- Telegram bot integration.
- Gmail integration with user consent.
- Background processing.
- Redis caching.
- Automated notifications.
- Analytics and reporting.
- Multiple backend instances.
- Load balancing.

These are possible architectural extensions, not features that should be presented as already implemented.

---

## 14. Project Architecture vs Project Structure vs Project Logic

These concepts are related, but they are not identical.

| Concept              | Meaning                                                    | Example                           |
| -------------------- | ---------------------------------------------------------- | --------------------------------- |
| Project Architecture | Overall design and relationships between system components | React → FastAPI → PostgreSQL      |
| Project Structure    | How files and folders are organized                        | routers/, models.py, components/  |
| Project Logic        | How the application processes operations                   | Add transaction → validate → save |

### Simple Example

Architecture tells us:

"React communicates with FastAPI, and FastAPI communicates with PostgreSQL."

Structure tells us:

"Transaction API endpoints are organized inside routers/transactions.py."

Logic tells us:

"When a user adds a transaction, the backend validates it and saves it for that authenticated user."

---

## 15. Best Practices for Good Project Architecture

1. **Separation of Concerns:** Each layer should have a clear responsibility.
2. **Modularity:** Divide the application into meaningful modules.
3. **Reusability:** Reuse common components and functions.
4. **Maintainability:** Keep code organized and understandable.
5. **Security:** Protect sensitive operations and user information.
6. **Scalability:** Design the system so it can grow when needed.
7. **Testability:** Keep important logic easy to test.
8. **Configuration Management:** Keep environment-specific settings outside source code.
9. **Error Handling:** Handle failures consistently.
10. **Documentation:** Document important architectural decisions.

---

## 16. Interview Questions

### Q1. What is project architecture?

Project architecture describes the overall organization of an application, including its components, responsibilities, and communication.

### Q2. Which architecture does SmartSpend follow?

SmartSpend follows a client-server architecture with a React frontend, FastAPI backend, and PostgreSQL database. Its backend can be organized as a modular monolith.

### Q3. Why did you choose React?

React provides reusable components and state management capabilities, making it suitable for building interactive user interfaces.

### Q4. Why did you choose FastAPI?

FastAPI provides API development features, request validation integration, automatic API documentation, and support for asynchronous endpoints.

### Q5. Why did you choose PostgreSQL?

PostgreSQL is a relational database that supports structured data, relationships, transactions, and complex queries.

### Q6. What is the responsibility of SQLAlchemy?

SQLAlchemy provides the ORM and database interaction layer, allowing Python code to work with database records.

### Q7. Why separate frontend and backend?

It separates user interface responsibilities from business logic and database operations. Both layers can be developed and maintained independently.

### Q8. What is separation of concerns?

It means dividing an application into components or modules with distinct responsibilities.

### Q9. What is a modular monolith?

It is a single deployable application organized into separate functional modules.

### Q10. Can SmartSpend support more features in the future?

Yes. Its frontend, backend, and database can be extended with additional modules and services. The architecture can also evolve if real usage creates new requirements.

---

## 17. Practical Exercises

Try these exercises using your SmartSpend code.

### Exercise 1: Identify Architecture Layers

Find the frontend, backend, and database responsibilities in your project.

### Exercise 2: Trace an API Request

Follow the GET /api/transactions request from the React component to PostgreSQL and back.

### Exercise 3: Identify Backend Modules

Identify where authentication, transaction, budget, and category operations are implemented.

### Exercise 4: Explain Database Relationships

Explain how users, transactions, categories, and budgets are connected.

### Exercise 5: Explain Authentication Architecture

Explain why the application uses both a Google ID token and an application JWT.

### Exercise 6: Future Architecture

Explain how you would add Telegram integration without mixing all bot-related logic into the existing transaction routes.

---

## 18. Final Summary

Project architecture is the blueprint that defines how an application is organized and how its components interact.

In SmartSpend:

- React manages the frontend.
- Vite supports frontend development and builds.
- Tailwind CSS handles styling.
- FastAPI manages backend APIs.
- Pydantic validates data.
- SQLAlchemy handles database operations.
- PostgreSQL stores application data.
- Google Sign-In verifies user identity.
- JWT protects authenticated API requests.

### Remember

```text
Project Architecture
        |
        v
Defines Application Components
        |
        v
Defines Responsibilities
        |
        v
Defines Communication
        |
        v
Defines Data Flow
        |
        v
Makes the Application Easier
to Maintain and Extend
```

**The main idea:**

Good project architecture is not about using the maximum number of technologies. It is about organizing the technologies you need so that every component has a clear responsibility and the application remains understandable as it grows.
