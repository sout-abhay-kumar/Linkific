
# React Interview Questions – SmartSpend (ExpenseTracker)

This document contains three React interview questions based on the frontend implementation of my SmartSpend ExpenseTracker project.

## 1. What are React components, and why did you divide your application into components?

### Answer

React components are reusable and independent pieces of a user interface. They allow developers to divide a large application into smaller, manageable parts.

I divided my ExpenseTracker application into components to make the frontend easier to develop, maintain, and reuse.

### Why Are Components Important?

- **Reusability:** The same component can be used in multiple places.
- **Maintainability:** Smaller components are easier to understand and update.
- **Separation of Concerns:** Each component can handle a specific responsibility.
- **Code Organization:** Components keep the application structure organized.
- **Consistency:** Reusable components help maintain a consistent UI.

### How I Used Components in My Project

Some examples of components in my ExpenseTracker application include:

| Component | Responsibility |
|---|---|
| Header | Displays application navigation and user-related actions |
| Dashboard | Displays financial summaries and dashboard information |
| TransactionForm | Handles transaction input |
| TransactionList | Displays transaction records |
| TransactionCard | Displays an individual transaction |
| Budget | Handles monthly budget information |

### Example

```jsx
function TransactionCard({ transaction }) {
  return (
    <div className="rounded-lg border p-4">
      <h3>{transaction.description}</h3>
      <p>₹{transaction.amount}</p>
    </div>
  );
}

export default TransactionCard;
```

**Explanation:**

- `TransactionCard` is a functional React component.
- It receives transaction data through props.
- It displays the transaction description and amount.
- It can be reused to display multiple transactions.

---

## 2. What is the difference between props and state in React?

### Answer

Props and state are two important concepts in React used to manage data inside components.

**Props** allow a parent component to pass data to a child component.

**State** stores data that belongs to a component and can change over time. When state changes, React updates the relevant UI.

### Difference Between Props and State

| Props | State |
|---|---|
| Passed from parent to child | Managed by a component or shared state owner |
| Read-only from the receiving component's perspective | Updated using state setters |
| Used to share data between components | Used to manage changing data |
| Changes when the parent provides new values | Changes when the state setter is called |

### Example: Props

```jsx
function Dashboard({ username }) {
  return <h1>Welcome, {username}</h1>;
}

function App() {
  return <Dashboard username="Abhay" />;
}
```

In this example, `App` passes the `username` prop to `Dashboard`.

### Example: State

```jsx
import { useState } from "react";

function TransactionCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Total Transactions: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Add Transaction
      </button>
    </div>
  );
}
```

In this example:

- `useState(0)` initializes the state.
- `count` stores the current value.
- `setCount()` updates the value.
- React re-renders the component when the state changes.

### How I Use These Concepts in My Project

- Props can be used to pass transaction data from `TransactionList` to `TransactionCard`.
- State can manage form inputs, loading indicators, filters, and transaction data.
- Shared state can be managed in a common parent component when multiple components need the same information.

---

## 3. How does React communicate with your FastAPI backend?

### Answer

React communicates with my FastAPI backend through HTTP requests using an API client.

The frontend sends requests to backend API endpoints, and FastAPI processes those requests and returns responses, usually in JSON format.

### Communication Flow

1. A user performs an action on the React frontend.
2. React calls the appropriate API function.
3. The API client sends an HTTP request to FastAPI.
4. FastAPI receives and validates the request.
5. The backend performs the required operation.
6. SQLAlchemy communicates with PostgreSQL when database access is needed.
7. FastAPI returns a JSON response.
8. React processes the response and updates the UI.

### Architecture Diagram

```text
User
 |
 | Performs an action
 v
React Component
 |
 | Calls API Function
 v
API Client (Fetch / Axios)
 |
 | HTTP Request
 v
FastAPI Backend
 |
 | Database Operation
 v
SQLAlchemy
 |
 v
PostgreSQL
 |
 | Query Result
 v
FastAPI Backend
 |
 | JSON Response
 v
React Frontend
 |
 | Updates UI
 v
User
```

### Example: Fetching Transactions

```jsx
async function getTransactions() {
  try {
    const response = await fetch(
      `${API_URL}/api/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

**Explanation:**

- `fetch()` sends an HTTP request to the backend.
- The `Authorization` header sends the application JWT.
- `response.ok` checks whether the HTTP response indicates success.
- `response.json()` converts the JSON response body into a JavaScript value.
- `try...catch` handles errors.

*Note: This is a simplified example. The actual API URL, token access, and response structure should match the implementation in the project.*

### Why Is This Communication Important?

- It separates frontend and backend responsibilities.
- It allows React to display data stored in PostgreSQL.
- It enables users to create, update, retrieve, and delete transactions.
- It allows the frontend to display loading states and error messages.

---

# Quick Revision

| Question | Main Concepts |
|---|---|
| What are React components? | Reusability, functional components, separation of concerns |
| Difference between props and state? | Data sharing, `useState`, component re-rendering |
| How does React communicate with FastAPI? | HTTP requests, API client, JSON, JWT, REST APIs |

# Additional Practice Questions

Try answering these questions without looking at the answers:

1. What is the purpose of `useEffect()` in React?
2. What is conditional rendering, and where can you use it in an ExpenseTracker application?
3. What is the difference between controlled and uncontrolled components?

# Interview Preparation Tips

1. Explain each concept using an example from your ExpenseTracker project.
2. Understand how data moves between parent and child components.
3. Be able to explain how a transaction is added and displayed.
4. Understand how React handles loading and error states.
5. Be prepared to explain how JWT is sent with protected API requests.
6. Do not memorize code without understanding what each line does.
