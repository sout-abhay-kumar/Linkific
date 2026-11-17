# Code Review Exercise

## 1. What Is Code Review?

**Code Review** is the process of examining source code written by a developer to identify mistakes, improve code quality, check coding standards, and ensure that the code works as expected.

In simple words:

> Code review means checking someone else's code (or your own code) to find bugs, improve readability, and make the application more reliable.

Code review is an important practice in professional software development.

For example, imagine a developer creates a function to calculate the total expenses of a user.

Before merging that code into the main project, another developer checks:

- Is the logic correct?
- Are there any bugs?
- Is the code readable?
- Are variable names meaningful?
- Is the function efficient?
- Are errors handled properly?
- Does the code follow project conventions?

This process is called Code Review.

---

## 2. Why Is Code Review Important?

Code review helps developers maintain the quality of a software project.

### Benefits

1. **Bug Detection:** Finds logical errors and potential bugs before they reach users.
2. **Code Quality:** Improves code readability and organization.
3. **Security:** Helps identify security vulnerabilities.
4. **Performance:** Identifies inefficient operations.
5. **Knowledge Sharing:** Helps developers learn from one another.
6. **Consistency:** Ensures that the project follows common coding standards.
7. **Maintainability:** Makes future modifications easier.
8. **Collaboration:** Encourages communication between developers.

---

## 3. When Is Code Review Performed?

Code review is commonly performed before merging changes into the main branch of a Git repository.

A typical development workflow looks like this:

1. Developer creates a feature branch.
2. Developer writes or modifies code.
3. Developer tests the changes.
4. Developer pushes the branch to GitHub.
5. Developer creates a Pull Request (PR).
6. Other developers review the changes.
7. Developer fixes requested issues.
8. Approved changes are merged into the main branch.

### Example Git Workflow

```text
main
 |
 |-------------------------
                           |
                      feature branch
                           |
                     Write new code
                           |
                     Test the code
                           |
                     Push to GitHub
                           |
                     Create Pull Request
                           |
                       Code Review
                           |
                  ---------------------
                  |                   |
                Changes             Approved
                  |                   |
              Fix issues              |
                  |                   |
                  -------- Merge ------
                           |
                          main
```

---

## 4. What Should We Check During Code Review?

A good code review should examine multiple aspects of the code.

### 4.1 Code Correctness

Check whether the code produces the expected result.

Questions:

- Does the function work correctly?
- Are calculations accurate?
- Are conditions correct?
- Are edge cases handled?

### 4.2 Code Readability

Code should be easy to understand.

Bad example:

```python
def c(a, b):
    return a + b
```

Better example:

```python
def calculate_total(amount, tax):
    return amount + tax
```

The second example uses meaningful function and parameter names.

### 4.3 Code Duplication

Check whether the same logic is repeated unnecessarily.

Bad example:

```python
def get_expense_total():
    return sum([100, 200, 300])

def get_income_total():
    return sum([500, 600, 700])
```

If the same calculation logic is used in multiple places, consider creating a reusable function.

### 4.4 Error Handling

Check whether the application handles errors properly.

Bad example:

```python
def divide(a, b):
    return a / b
```

Better example:

```python
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")

    return a / b
```

### 4.5 Performance

Check whether the code performs unnecessary operations.

For example, repeatedly querying the database inside a loop can create performance problems.

### 4.6 Security

Check whether the code:

- Exposes passwords or API keys.
- Accepts unvalidated input.
- Allows unauthorized access.
- Handles authentication correctly.
- Protects user-specific data.
- Uses unsafe database queries.

### 4.7 Testing

Check whether appropriate tests exist for the modified functionality.

For example:

- Valid input.
- Invalid input.
- Empty input.
- Unauthorized requests.
- Boundary conditions.

---

## 5. Code Review in React

When reviewing React code, pay attention to the following areas.

### 5.1 Component Structure

Components should have clear responsibilities.

Bad example:

```jsx
function Dashboard() {
  // Authentication
  // API requests
  // Transaction calculations
  // Form handling
  // Dashboard UI
  // Budget calculations

  return <div>Dashboard</div>;
}
```

A large component containing everything becomes difficult to maintain.

Better approach:

```text
components/
    Header.jsx
    Sidebar.jsx
    TransactionCard.jsx
    BudgetCard.jsx

pages/
    Dashboard.jsx

hooks/
    useTransactions.js

services/
    transactionService.js
```

### 5.2 State Management

Check whether React state is used appropriately.

Bad example:

```jsx
let count = 0;

function Counter() {
  function increment() {
    count++;
  }

  return <button onClick={increment}>{count}</button>;
}
```

The variable `count` is not React state, so changing it does not trigger a React re-render.

Better example:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 5.3 API Error Handling

Check whether API requests handle loading and error states.

Example:

```jsx
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

async function fetchTransactions() {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch("http://localhost:8000/api/transactions");

    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }

    const data = await response.json();

    setTransactions(data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

A reviewer should check whether:

- Loading state is displayed.
- Errors are handled.
- Invalid responses are handled.
- Data is updated correctly.

---

## 6. Code Review in Python and FastAPI

When reviewing backend code, examine the following.

### 6.1 Function Responsibilities

Functions should have clear and focused responsibilities.

Bad example:

```python
def process_transaction(db, data):
    # Validate data
    # Authenticate user
    # Calculate totals
    # Save transaction
    # Send notification
    # Generate report
    pass
```

This function is responsible for too many things.

A better design separates responsibilities into smaller functions or modules.

### 6.2 Input Validation

Use Pydantic schemas to validate incoming request data.

Example:

```python
from pydantic import BaseModel, Field

class TransactionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    amount: float = Field(gt=0)
    kind: str
```

This helps prevent invalid data from entering the application.

### 6.3 Database Operations

Review whether:

- Database sessions are managed correctly.
- Transactions are committed when required.
- Failed operations are handled.
- Database queries are efficient.
- User ownership is checked.

### 6.4 Authentication and Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What is this user allowed to access?

For ExpenseTracker, users should only be able to access their own transactions and budgets.

A reviewer should check whether every protected database query is scoped to the authenticated user.

---

# 7. Practical Code Review Exercise

Now let's perform a code review using a simple ExpenseTracker example.

## Exercise 1: Review Python Code

Consider the following code:

```python
transactions = []

def add_transaction(title, amount, kind):
    transaction = {
        "title": title,
        "amount": amount,
        "kind": kind
    }

    transactions.append(transaction)

    return transaction


def get_total_expenses():
    total = 0

    for transaction in transactions:
        if transaction["kind"] == "expense":
            total = total + transaction["amount"]

    return total
```

### Your Review Tasks

Examine the code and answer these questions:

1. What happens if the transaction title is empty?
2. What happens if the amount is negative?
3. What happens if `kind` contains an invalid value?
4. Is there any input validation?
5. Is the code readable?
6. Can the calculation be improved?
7. What happens if the transaction dictionary is missing the `amount` key?

### Improved Version

```python
transactions = []

def add_transaction(title, amount, kind):

    if not title or not title.strip():
        raise ValueError("Transaction title cannot be empty")

    if amount <= 0:
        raise ValueError("Amount must be greater than zero")

    if kind not in ["income", "expense"]:
        raise ValueError("Invalid transaction type")

    transaction = {
        "title": title.strip(),
        "amount": amount,
        "kind": kind
    }

    transactions.append(transaction)

    return transaction


def get_total_expenses():

    return sum(
        transaction["amount"]
        for transaction in transactions
        if transaction["kind"] == "expense"
    )
```

### Improvements Made

| Problem                      | Improvement             |
| ---------------------------- | ----------------------- |
| Empty transaction title      | Added title validation  |
| Negative amount              | Added amount validation |
| Invalid transaction type     | Added allowed values    |
| Unnecessary calculation code | Used `sum()`            |
| Untrimmed title              | Used `strip()`          |

**Note:** This is an in-memory learning example. It does not replace database persistence, Pydantic validation, or authentication in your actual FastAPI application.

---

## Exercise 2: Review React Code

Consider the following React component:

```jsx
function Transactions({ transactions }) {
  return (
    <div>
      {transactions.map((transaction) => (
        <div>
          <h3>{transaction.title}</h3>
          <p>{transaction.amount}</p>
        </div>
      ))}
    </div>
  );
}

export default Transactions;
```

### Your Review Tasks

1. Is there anything missing in the `.map()` rendering?
2. What happens if `transactions` is undefined?
3. Is there an empty-state message?
4. Is the component easy to maintain?
5. How could the UI be improved?

### Improved Version

```jsx
function Transactions({ transactions = [] }) {
  if (transactions.length === 0) {
    return <p>No transactions found.</p>;
  }

  return (
    <div>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <h3>{transaction.title}</h3>
          <p>{transaction.amount}</p>
        </div>
      ))}
    </div>
  );
}

export default Transactions;
```

### Improvements Made

| Problem                | Improvement                     |
| ---------------------- | ------------------------------- |
| Missing React key      | Added `key={transaction.id}`    |
| Undefined transactions | Added a default empty array     |
| No empty state         | Added a message                 |
| Rendering behavior     | Improved handling of empty data |

---

# 8. Code Review Checklist

Use this checklist whenever you review code.

## General Code Quality

- [ ] Are variable and function names meaningful?
- [ ] Is the code readable?
- [ ] Is the code properly formatted?
- [ ] Is unnecessary code removed?
- [ ] Is repeated logic minimized?
- [ ] Are functions focused on clear responsibilities?

## Frontend Review

- [ ] Are React components organized properly?
- [ ] Is React state managed correctly?
- [ ] Are list elements assigned unique keys?
- [ ] Are API requests handled correctly?
- [ ] Are loading and error states implemented?
- [ ] Is the UI responsive?
- [ ] Are navigation routes working?

## Backend Review

- [ ] Are API endpoints organized properly?
- [ ] Is request data validated?
- [ ] Are errors handled correctly?
- [ ] Are database operations correct?
- [ ] Is authentication implemented correctly?
- [ ] Is authorization checked?
- [ ] Are sensitive values kept out of source code?

## Testing

- [ ] Does the code work with valid input?
- [ ] Does it handle invalid input?
- [ ] Are edge cases considered?
- [ ] Are existing features still working?
- [ ] Have relevant tests been executed?

---

# 9. Code Review Comments

During a code review, developers leave comments explaining problems and suggesting improvements.

A good review comment should be:

- Clear.
- Specific.
- Respectful.
- Actionable.
- Focused on the code, not the developer.

### Example 1: Missing Validation

**Review Comment:**

> The amount field currently accepts negative values. Could we validate that the amount must be greater than zero before saving the transaction?

### Example 2: Code Duplication

**Review Comment:**

> This calculation appears in multiple components. Could we extract it into a reusable utility function?

### Example 3: Missing Error Handling

**Review Comment:**

> What happens if this API request fails? Could we add error handling and display an appropriate message to the user?

### Example 4: Security Issue

**Review Comment:**

> Please ensure that the transaction belongs to the authenticated user before returning or modifying it.

---

# 10. Code Review vs Testing

Both are important software quality practices, but they are different.

| Code Review                            | Testing                                    |
| -------------------------------------- | ------------------------------------------ |
| Examines source code                   | Executes code to verify behavior           |
| Can identify design problems           | Can identify runtime failures              |
| Checks readability and maintainability | Checks expected outputs                    |
| Can identify potential security issues | Can test security-related behavior         |
| Usually performed by developers        | Can be performed manually or automatically |

**Example:**

- Code review: Checking whether a transaction API validates negative amounts.
- Testing: Sending a negative amount to the API and verifying that it returns a validation error.

Both practices complement each other.

---

# 11. Code Review Tools

Some commonly used tools include:

| Tool                  | Purpose                                |
| --------------------- | -------------------------------------- |
| GitHub Pull Requests  | Review code changes before merging     |
| GitLab Merge Requests | Review and discuss code changes        |
| Ruff                  | Python linting and code-quality checks |
| Black                 | Python code formatting                 |
| ESLint                | JavaScript and React code analysis     |
| Prettier              | Code formatting                        |
| SonarQube             | Code quality and security analysis     |

These tools can automate certain checks, but they do not replace human code review.

---

# 12. What Should You Learn Next?

Recommended learning order:

1. Clean Code Principles
2. Code Readability
3. Code Refactoring
4. Software Testing
5. Unit Testing
6. Integration Testing
7. Git Branching
8. GitHub Pull Requests
9. Continuous Integration (CI)
10. Secure Code Review

---

# 13. Quick Revision

- Code review is the process of examining code to improve quality.
- It helps identify bugs, security issues, and inefficient logic.
- Code should be readable, reusable, and maintainable.
- React code reviews should examine components, state, rendering, and API handling.
- FastAPI code reviews should examine validation, database operations, authentication, and authorization.
- GitHub Pull Requests are commonly used for code reviews.
- Automated tools help identify issues, but human review is still important.
- Code review and software testing are complementary practices.

---

# 14. Final Practical Assignment

Perform a code review of your own ExpenseTracker project.

### Tasks

1. Review your React components.
2. Check whether API calls handle errors properly.
3. Review your FastAPI routes.
4. Check request validation.
5. Check authentication and authorization.
6. Look for duplicated code.
7. Identify unnecessary database queries.
8. Check variable and function naming.
9. Review the project folder structure.
10. Write down the issues you discover and fix them.

### Expected Deliverable

Create a document named:

`Code_Review_Report.md`

Use this format:

```markdown
# ExpenseTracker Code Review Report

## 1. Files Reviewed

- Frontend:
- Backend:

## 2. Issues Identified

| File | Issue | Priority |
| ---- | ----- | -------- |
|      |       |          |

## 3. Improvements Made

-
-
-

## 4. Remaining Issues

-
-

## 5. Testing Performed

-
-

## 6. Conclusion

Summarize the code quality improvements.
```

**Goal:** Learn to examine code critically, identify problems, and improve software quality before considering a feature complete.
