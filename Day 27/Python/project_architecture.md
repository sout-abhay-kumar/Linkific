# Project Architecture

## 1. What Is Project Architecture?

**Project Architecture** is the overall structure and design of a software application. It explains how different parts of a project are organized, how they communicate with each other, and how data flows through the application.

In simple words:

> Project architecture describes how a software application is divided into different components, what each component does, and how those components work together.

For example, an ExpenseTracker application contains multiple technologies:

- React – Frontend
- FastAPI – Backend
- PostgreSQL – Database
- SQLAlchemy – Database interaction
- Google OAuth – Authentication

Project architecture explains how all these technologies work together.

---

## 2. Why Do We Need Project Architecture?

Without proper architecture, developers might put all frontend code into one file, database queries directly inside API routes, and authentication logic everywhere.

As the project grows, this becomes difficult to understand and maintain.

Project architecture helps us:

1. **Code Organization:** Keep related files and functionality together.
2. **Maintainability:** Make changes without affecting unrelated components.
3. **Scalability:** Add new features without restructuring the entire application.
4. **Reusability:** Reuse components, functions, and services.
5. **Debugging:** Identify where a problem is occurring.
6. **Team Collaboration:** Help developers understand their responsibilities.
7. **Security:** Separate authentication, authorization, and business logic.

---

## 3. Types of Project Architecture

There are different architectural approaches used in software development.

### 3.1 Monolithic Architecture

In Monolithic Architecture, an application is developed and deployed as one unified application.

Its different functionalities may be organized into modules, but they are part of the same application.

**Example:**

An ExpenseTracker backend handles:

- Authentication
- Transactions
- Budgets
- Categories
- Analytics

**Advantages:**

- Easy to start developing.
- Simple deployment.
- Suitable for small and medium-sized projects.

**Disadvantages:**

- Can become difficult to maintain as the application grows.
- Components can become tightly coupled if not designed properly.
- Scaling individual features independently is difficult.

### 3.2 Microservices Architecture

In Microservices Architecture, an application is divided into multiple independent services.

Each service handles a specific business responsibility.

**Example:**

An ExpenseTracker might have:

- Authentication Service
- Transaction Service
- Budget Service
- Notification Service
- Analytics Service

**Advantages:**

- Services can be developed independently.
- Individual services can be scaled separately.
- Different technologies can be used for different services.

**Disadvantages:**

- More complicated deployment.
- Communication between services requires additional work.
- Monitoring and debugging become more difficult.

### 3.3 Layered Architecture

Layered Architecture divides an application into logical layers. Each layer has a specific responsibility.

A common backend structure contains:

| Layer                | Responsibility                            |
| -------------------- | ----------------------------------------- |
| Presentation Layer   | Handles incoming requests and responses   |
| Business Logic Layer | Contains application rules and operations |
| Data Access Layer    | Handles database operations               |
| Database Layer       | Stores application data                   |

**Example workflow:**

1. Presentation layer receives a request.
2. Business logic layer validates and processes the request.
3. Data access layer communicates with the database.
4. Database layer stores the information.
5. Response travels back to the user.

**Advantages:**

- Clear separation of responsibilities.
- Easier testing and debugging.
- Better maintainability.
- Easier to modify individual layers.

---

## 4. Understanding ExpenseTracker Architecture

ExpenseTracker follows a **Client-Server Architecture**.

The frontend communicates with the backend through APIs, and the backend communicates with PostgreSQL to store and retrieve data.

### 4.1 Frontend – React

The frontend is the part of the application users interact with.

**Responsibilities:**

- Display the dashboard.
- Show transactions and budgets.
- Provide forms to add or update expenses.
- Handle user interactions.
- Send API requests to the backend.
- Display loading states and error messages.
- Manage frontend authentication state.

**Example folder structure:**

```text
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── package.json
└── vite.config.js
```

_Note: This is an example structure. Your actual project structure may differ._

### 4.2 Backend – FastAPI

The backend handles application logic and provides APIs to the frontend.

**Responsibilities:**

- Handle HTTP requests.
- Authenticate users.
- Validate incoming data.
- Process transactions and budgets.
- Communicate with PostgreSQL.
- Return JSON responses.

**Example folder structure:**

```text
backend/
│
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── transactions.py
│   │   ├── budgets.py
│   │   └── categories.py
│   │
│   ├── schemas/
│   ├── services/
│   └── core/
│
├── requirements.txt
└── .env
```

_Note: This is an illustrative organization, not necessarily the exact structure of your project._

### 4.3 Database – PostgreSQL

The database stores application information permanently.

ExpenseTracker uses tables such as:

| Table        | Purpose                           |
| ------------ | --------------------------------- |
| users        | Stores user information           |
| transactions | Stores income and expense records |
| categories   | Stores transaction categories     |
| budgets      | Stores monthly budget information |

For example, when a user adds an expense, the backend saves its information in the `transactions` table.

### 4.4 SQLAlchemy – Database Interaction

SQLAlchemy is an **Object Relational Mapper (ORM)**.

It allows Python code to interact with database tables using Python objects instead of writing every SQL query manually.

**Example:**

```python
new_transaction = Transaction(
    title="Lunch",
    amount=150,
    kind="expense",
    category_id=1
)

db.add(new_transaction)
db.commit()
```

Explanation:

- `Transaction` represents a database model.
- `db.add()` adds the object to the current database session.
- `db.commit()` saves the change to the database.

### 4.5 Google Authentication

Google Sign-In allows users to authenticate using their Google accounts.

**Authentication workflow:**

1. User clicks Sign in with Google.
2. Google provides an ID token.
3. React sends the token to FastAPI.
4. FastAPI verifies the token.
5. Backend identifies or creates the application user.
6. Backend issues a JWT access token.
7. React uses the access token for protected API requests.

---

## 5. How Different Components Communicate

Let's understand what happens when a user adds an expense.

### Step 1: User Interaction

The user fills out an expense form in React.

**Example request data:**

```json
{
  "title": "Lunch",
  "amount": 150,
  "kind": "expense",
  "category_id": 1,
  "transaction_date": "2026-11-17"
}
```

### Step 2: API Request

React sends an HTTP POST request to FastAPI.

```http
POST /api/transactions
```

The request includes expense data and the user's authentication token.

### Step 3: Backend Processing

FastAPI:

- Receives the request.
- Checks authentication.
- Validates request data.
- Processes the transaction.

### Step 4: Database Operation

SQLAlchemy communicates with PostgreSQL and inserts the transaction.

### Step 5: API Response

FastAPI returns a JSON response.

```json
{
  "id": 101,
  "title": "Lunch",
  "amount": 150,
  "kind": "expense",
  "category_id": 1
}
```

### Step 6: Frontend Update

React receives the response and updates the transaction list displayed on the dashboard.

---

## 6. Important Architecture Concepts

| Concept                    | Meaning                                                      |
| -------------------------- | ------------------------------------------------------------ |
| Client-Server Architecture | Separates the user-facing client from the server             |
| Monolithic Architecture    | Organizes an application as one unified application          |
| Microservices              | Divides an application into independently operating services |
| Layered Architecture       | Separates responsibilities into logical layers               |
| MVC                        | Model-View-Controller design pattern                         |
| Separation of Concerns     | Gives different responsibilities to different modules        |
| Modularity                 | Divides software into independent, organized modules         |
| Scalability                | Ability to handle increasing workload                        |
| Maintainability            | How easily software can be modified and maintained           |
| Loose Coupling             | Reduces unnecessary dependencies between components          |
| High Cohesion              | Keeps closely related responsibilities together              |
| API Design                 | Defines how application components communicate               |

---

## 7. Architecture vs Project Structure vs Design Pattern

These three terms are related, but they are not the same.

| Term                 | What It Describes                                       | Example                                  |
| -------------------- | ------------------------------------------------------- | ---------------------------------------- |
| Project Architecture | Overall organization and interaction of the application | React + FastAPI + PostgreSQL             |
| Project Structure    | How files and folders are organized                     | `routers/`, `models.py`, `services/`     |
| Design Pattern       | A reusable solution to a common software design problem | MVC, Repository Pattern, Factory Pattern |

**Simple analogy:**

- Architecture: How an entire building is designed.
- Project Structure: How rooms and departments are organized.
- Design Patterns: Reusable solutions to common construction problems.

---

## 8. How to Explain Your Project Architecture

If someone asks you to explain your ExpenseTracker architecture during an interview or project presentation, you can say:

> My project follows a client-server architecture. The frontend is developed using React, which handles the user interface and user interactions. The frontend communicates with the backend through REST APIs developed using FastAPI.
>
> The backend handles authentication, request validation, business logic, and database operations. PostgreSQL is used for persistent data storage, while SQLAlchemy acts as the ORM to interact with the database.
>
> For authentication, I have integrated Google Sign-In. The backend verifies the Google ID token and generates a JWT access token, which is used to authenticate subsequent protected API requests.
>
> The application is divided into separate frontend and backend modules to improve code organization, maintainability, and future extensibility.

---

## 9. What Should You Study Next?

For a developer working with React, FastAPI, and PostgreSQL, learn these topics in this order:

1. Client-Server Architecture
2. Three-Tier Architecture
3. Layered Architecture
4. Separation of Concerns
5. MVC Architecture
6. Repository Pattern
7. Service Layer Pattern
8. Monolithic vs Microservices
9. System Design Fundamentals

**Important:** You do not need microservices for every project. A well-organized monolithic backend is a perfectly reasonable starting point for ExpenseTracker.

---

## 10. Quick Revision

- Project architecture explains how an application is designed and how its components communicate.
- React handles the frontend.
- FastAPI handles backend requests and application logic.
- SQLAlchemy connects Python application code with PostgreSQL.
- PostgreSQL stores persistent data.
- APIs allow the frontend and backend to communicate.
- Authentication protects user-specific resources.
- Good architecture makes an application easier to maintain, test, and extend.

---
