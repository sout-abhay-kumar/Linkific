
# Component Communication in React

## 1. What is Component Communication?

Component Communication is the process through which different React components share information and interact with each other.

In React, an application is divided into small, reusable components. Each component handles a particular part of the user interface.

For example, in an ExpenseTracker application, we might have:

- `App` – Main application component.
- `Header` – Displays navigation and user information.
- `Dashboard` – Displays expense summaries.
- `TransactionList` – Displays all transactions.
- `TransactionForm` – Allows users to add transactions.
- `TransactionCard` – Displays an individual transaction.

These components often need to exchange information.

For example:

- A parent component passes transaction data to a child.
- A child component notifies its parent when a transaction is added.
- Two sibling components share information through their common parent.
- Multiple components access shared application data through Context.

This process is called component communication.

---

## 2. Why Do Components Need to Communicate?

Consider an ExpenseTracker application.

Suppose a user adds a new expense through a form.

After adding the expense:

1. The form needs to send the new transaction information.
2. The transaction list needs to display the new expense.
3. The dashboard needs to update the total expenses.
4. The monthly summary may also need to refresh.

These components need to coordinate their behavior.

Without proper component communication, managing application data becomes difficult.

Component communication helps us:

- Share data between components.
- Avoid unnecessary duplicate state.
- Keep components reusable.
- Maintain a predictable data flow.
- Build scalable React applications.
- Update multiple parts of the UI when data changes.

---

## 3. Types of Component Communication

React commonly uses the following approaches:

1. Parent-to-Child Communication
2. Child-to-Parent Communication
3. Sibling-to-Sibling Communication
4. Component Communication Using Context API
5. Component Communication Using Shared State

---

## 4. Parent-to-Child Communication (Props)

Parent-to-child communication happens when a parent component sends data to its child component using props.

Props are read-only values passed from one component to another.

### Example

Suppose the `Dashboard` component has transaction data and needs to display it inside `TransactionList`.

**Parent Component: Dashboard.jsx**

```jsx
import TransactionList from "./TransactionList";

function Dashboard() {
  const transactions = [
    { id: 1, title: "Lunch", amount: 250 },
    { id: 2, title: "Travel", amount: 150 },
  ];

  return (
    <div>
      <h1>Dashboard</h1>

      <TransactionList transactions={transactions} />
    </div>
  );
}

export default Dashboard;
```

**Child Component: TransactionList.jsx**

```jsx
function TransactionList({ transactions }) {
  return (
    <div>
      <h2>Transactions</h2>

      {transactions.map((transaction) => (
        <p key={transaction.id}>
          {transaction.title} - ₹{transaction.amount}
        </p>
      ))}
    </div>
  );
}

export default TransactionList;
```

### How Does It Work?

```text
Dashboard (Parent)
       |
       | passes transactions as props
       v
TransactionList (Child)
       |
       v
Displays transactions
```

### Important Points

- Props are used to pass data from parent to child.
- Props are read-only.
- A child should not directly modify its parent's state.
- Props make components reusable.

### When Should We Use It?

Use props when a component needs information from its parent.

Examples:

- Passing transaction data to a transaction list.
- Passing a username to a header.
- Passing an amount to a summary card.
- Passing a category name to a category component.

---

## 5. Child-to-Parent Communication (Callback Functions)

Sometimes a child component needs to notify its parent that something has happened.

For example, a user adds a new transaction through a form.

The form is a child component, but the transaction state is managed by its parent.

The child can communicate with the parent by calling a function received through props.

This is commonly called callback-based communication.

### Example

**Parent Component: Dashboard.jsx**

```jsx
import { useState } from "react";
import TransactionForm from "./TransactionForm";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  function handleAddTransaction(newTransaction) {
    setTransactions((previousTransactions) => [
      ...previousTransactions,
      newTransaction,
    ]);
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <TransactionForm
        onAddTransaction={handleAddTransaction}
      />

      <h2>Transactions</h2>

      {transactions.map((transaction) => (
        <p key={transaction.id}>
          {transaction.title} - ₹{transaction.amount}
        </p>
      ))}
    </div>
  );
}

export default Dashboard;
```

**Child Component: TransactionForm.jsx**

```jsx
function TransactionForm({ onAddTransaction }) {
  function handleSubmit(event) {
    event.preventDefault();

    const newTransaction = {
      id: Date.now(),
      title: "Groceries",
      amount: 500,
    };

    onAddTransaction(newTransaction);
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">
        Add Transaction
      </button>
    </form>
  );
}

export default TransactionForm;
```

### How Does It Work?

```text
Dashboard (Parent)
       |
       | passes callback function
       v
TransactionForm (Child)
       |
       | calls callback with new data
       v
Dashboard (Parent)
       |
       | updates state
       v
React re-renders affected UI
```

### Important Points

- The parent defines the function.
- The parent passes the function to the child as a prop.
- The child calls the function when an event occurs.
- The parent updates its state.
- React updates the components that depend on that state.

### When Should We Use It?

Use callback functions when a child needs to notify its parent about an event.

Examples:

- Adding a transaction.
- Deleting a transaction.
- Submitting a form.
- Closing a modal.
- Changing a filter.

---

## 6. Sibling-to-Sibling Communication

Sibling components are components that share the same parent.

React does not normally provide a direct mechanism for one sibling to modify another sibling's state.

Instead, we use their common parent to coordinate communication.

This pattern is known as lifting state up.

### Example

Suppose an ExpenseTracker dashboard has two sibling components:

- `TransactionForm`
- `TransactionList`

The form adds transactions, and the list displays them.

Both components need access to the same transaction data.

We can manage that data in their common parent.

**Dashboard.jsx**

```jsx
import { useState } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  function addTransaction(transaction) {
    setTransactions((previous) => [
      ...previous,
      transaction,
    ]);
  }

  return (
    <div>
      <TransactionForm onAdd={addTransaction} />

      <TransactionList transactions={transactions} />
    </div>
  );
}

export default Dashboard;
```

### Communication Flow

```text
             Dashboard
                 |
          -----------------
          |               |
          v               v
   TransactionForm   TransactionList
          |               ^
          |               |
          v               |
    Add Transaction       |
          |               |
          v               |
   Dashboard updates state
          |
          v
   Passes updated transactions
          |
          v
   TransactionList updates
```

### What Is Lifting State Up?

Lifting state up means moving state from a child component to its nearest common parent so that multiple components can share and use that state.

### When Should We Use It?

Use lifting state up when:

- Two or more sibling components need the same data.
- One component updates data that another component displays.
- Multiple components need to stay synchronized.

---

## 7. Component Communication Using Context API

As an application grows, passing props through many intermediate components can become difficult.

This problem is called prop drilling.

React provides the Context API to share data across components without manually passing props through every intermediate component.

### What Is Prop Drilling?

Suppose we have the following component hierarchy:

```text
App
 |
 v
Dashboard
 |
 v
Header
 |
 v
UserProfile
```

If `App` contains user information and only `UserProfile` needs it, we might pass the user prop through every intermediate component.

This is called prop drilling.

### Example Without Context API

```jsx
function App() {
  const user = {
    name: "Abhay",
  };

  return <Dashboard user={user} />;
}

function Dashboard({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  return <UserProfile user={user} />;
}

function UserProfile({ user }) {
  return <h2>Welcome, {user.name}</h2>;
}
```

Notice that `Dashboard` and `Header` only pass the user prop forward.

### Example With Context API

**Step 1: Create UserContext.jsx**

```jsx
import { createContext } from "react";

export const UserContext = createContext(null);
```

**Step 2: Provide the Context in App.jsx**

```jsx
import { UserContext } from "./UserContext";
import Dashboard from "./Dashboard";

function App() {
  const user = {
    name: "Abhay",
  };

  return (
    <UserContext.Provider value={user}>
      <Dashboard />
    </UserContext.Provider>
  );
}

export default App;
```

**Step 3: Consume the Context in UserProfile.jsx**

```jsx
import { useContext } from "react";
import { UserContext } from "./UserContext";

function UserProfile() {
  const user = useContext(UserContext);

  return <h2>Welcome, {user.name}</h2>;
}

export default UserProfile;
```

Now `UserProfile` can access the user information without receiving it through every intermediate component.

### Context Communication Flow

```text
          UserContext.Provider
                   |
                   v
                  App
                   |
                   v
               Dashboard
                   |
                   v
                 Header
                   |
                   v
              UserProfile
                   |
                   |
                   v
          useContext(UserContext)
                   |
                   v
            Access user data
```

### When Should We Use Context API?

Context is useful for data that many components need.

Examples:

- Authenticated user information.
- Theme settings.
- Language preferences.
- Application-wide configuration.

**Important:** Context is not automatically the best solution for every shared state problem. For simple parent-child communication, props are often easier.

---

## 8. Component Communication Using Shared State

Shared state is state managed in a location where multiple components can access or use it.

In a small React application, shared state can be managed by lifting state up to a common parent.

For larger applications, developers may use state-management libraries or tools such as Redux Toolkit or Zustand.

### Example: Shared Transaction State

```text
             Dashboard
                 |
          transactions state
                 |
          -----------------
          |               |
          v               v
   TransactionForm   TransactionList
          |               ^
          |               |
          v               |
    Add transaction       |
          |               |
          v               |
   Update shared state
          |
          v
    React re-render
```

### Common State Management Options

| Approach | Best Used For |
|---|---|
| useState | Local component state |
| Props | Parent-to-child data |
| Callback functions | Child-to-parent notifications |
| Lifting state up | Sharing state between siblings |
| Context API | Sharing data across component trees |
| Redux Toolkit | Centralized state management |
| Zustand | Lightweight shared state management |

---

## 9. Component Communication in ExpenseTracker

Let's relate these concepts to our actual project.

A simplified component hierarchy might look like this:

```text
App
 |
 v
Dashboard
 |
 |------ Header
 |
 |------ SummaryCards
 |
 |------ TransactionForm
 |
 |------ TransactionList
          |
          |------ TransactionCard
```

### Example Communication

| Component | Communication | Purpose |
|---|---|---|
| App | Context / Props | Provides application-level data |
| Dashboard | Props | Passes data to dashboard components |
| Header | Context / Props | Displays authenticated user |
| TransactionForm | Callback | Notifies parent about form submission |
| TransactionList | Props | Receives transaction data |
| TransactionCard | Props | Receives individual transaction details |

The exact implementation depends on how the project currently manages state and API calls.

### Example: Adding a Transaction

A typical flow in ExpenseTracker:

1. The user enters transaction details.
2. `TransactionForm` collects the input.
3. The frontend sends a POST request to FastAPI.
4. The backend validates and saves the transaction.
5. The API returns the created transaction.
6. The parent component or shared data layer updates the transaction state.
7. `TransactionList` receives the updated data.
8. React renders the new transaction.

```text
User
 |
 v
TransactionForm
 |
 | Submit
 v
API Request
 |
 v
FastAPI Backend
 |
 v
PostgreSQL
 |
 v
API Response
 |
 v
Parent / Shared State
 |
 v
TransactionList
 |
 v
Updated UI
```

Notice that component communication and API communication are different:

- Component communication happens between React components.
- API communication happens between the frontend and backend.

They work together, but they are not the same thing.

---

## 10. Important React Concepts Related to Component Communication

### Props

Props are values passed from a parent component to a child component.

### State

State is data managed by a React component or shared state-management mechanism.

When state changes, React can re-render components that depend on it.

### Callback Function

A function passed as a prop so that a child can notify its parent about an event.

### Lifting State Up

Moving state to the nearest common parent when multiple components need access to it.

### Prop Drilling

Passing props through multiple intermediate components that do not actually need the data.

### Context API

A React feature for sharing values with components in a subtree without manually passing props through every level.

### Re-rendering

The process through which React calls components again to determine the updated UI when relevant state or props change.

---

## 11. Best Practices for Component Communication

1. **Keep data flow predictable:** Prefer clear parent-to-child data flow.
2. **Use props for simple communication:** Do not introduce complex state management unnecessarily.
3. **Lift state only when needed:** Keep state close to the components that use it.
4. **Avoid unnecessary prop drilling:** Consider Context when many components need the same value.
5. **Keep components reusable:** Avoid tightly coupling components to unrelated application features.
6. **Use meaningful prop names:** For example, `onAddTransaction` is clearer than `callback`.
7. **Avoid duplicating state:** If a value can be derived from existing state, calculate it instead of maintaining a duplicate.
8. **Keep API logic organized:** Separate backend requests from presentation components when appropriate.
9. **Use Context carefully:** Avoid putting every application value into one large context.

---

## 12. Common Mistakes

| Mistake | Better Approach |
|---|---|
| Directly modifying props | Treat props as read-only |
| Mutating state directly | Use state setter functions |
| Passing too many unnecessary props | Simplify the component hierarchy |
| Using Context for every value | Choose the simplest suitable approach |
| Duplicating shared state | Maintain one source of truth |
| Making unrelated components dependent on each other | Communicate through their common parent or shared state |
| Updating UI before an API operation succeeds without handling failure | Handle loading, success, and error states |

---

## 13. Practical Exercises

### Exercise 1: Parent-to-Child Communication

Create a parent component named `Dashboard` and a child component named `SummaryCard`.

Pass the monthly expense total from the parent to the child using props.

### Exercise 2: Child-to-Parent Communication

Create a component named `TransactionForm`.

When the user submits the form, call a callback function to send the transaction data to its parent.

### Exercise 3: Sibling Communication

Create two sibling components:

- `TransactionForm`
- `TransactionList`

Use their common parent to share transaction state.

### Exercise 4: Context API

Create an `AuthContext` that makes authenticated user information available to multiple components.

### Exercise 5: Explain Your Project

Explain how adding a transaction updates the transaction list and dashboard summary.

---

## 14. Interview Questions

**Q1. What is component communication in React?**

Component communication is the process through which React components share data and coordinate their behavior using props, callbacks, shared state, Context API, or state-management tools.

**Q2. How do you pass data from parent to child?**

We use props to pass data from a parent component to a child component.

**Q3. How can a child communicate with its parent?**

The parent passes a callback function as a prop. The child calls that function when it needs to notify the parent.

**Q4. How do sibling components communicate?**

They can communicate through their common parent by lifting state up.

**Q5. What is prop drilling?**

Prop drilling is the process of passing props through multiple intermediate components to reach a deeply nested component.

**Q6. How does Context API solve prop drilling?**

Context allows components inside a provider's subtree to access shared values without passing props manually through every intermediate component.

**Q7. What is lifting state up?**

Lifting state up means moving state to the nearest common parent so multiple child components can share it.

**Q8. What is the difference between props and state?**

Props are passed into a component by its parent, while state is managed by a component or shared state mechanism.

**Q9. Does changing props cause a component to re-render?**

When a component receives changed props, React can re-render it to reflect the updated data.

**Q10. Is component communication the same as API communication?**

No. Component communication happens between frontend components, while API communication happens between the frontend and backend.

---

## 15. Summary

Component communication is essential for building organized and reusable React applications.

The main approaches are:

| Communication Type | Approach |
|---|---|
| Parent → Child | Props |
| Child → Parent | Callback Functions |
| Sibling ↔ Sibling | Lifting State Up |
| Deep Component Tree | Context API |
| Application-Wide Shared State | Context or State Management Libraries |

**Remember:**

- Props pass data downward.
- Callback functions allow children to notify parents.
- Lifting state up allows siblings to share data.
- Context helps avoid prop drilling.
- Shared state keeps multiple components synchronized.

The goal is to maintain predictable data flow while keeping components independent, reusable, and easy to maintain.
