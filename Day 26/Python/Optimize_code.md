
# Code Optimization

## 1. What Is Code Optimization?

Code optimization is the process of improving existing code so that it performs better, uses fewer resources, and is easier to maintain without changing its expected functionality.

In simple words:

**Code optimization means making your code more efficient without changing what it does.**

Optimization can improve:

- Execution speed
- Memory usage
- Database performance
- API response time
- Network requests
- Code readability
- Maintainability
- Application scalability

### Example

Unoptimized code:

```python
numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(number)
```

A more concise version:

```python
numbers = [1, 2, 3, 4, 5]

print(*numbers, sep="\n")
```

Both produce the same output, but the second is not necessarily faster.

**Important:** Shorter code does not automatically mean optimized code. Optimization is about measurable improvements, not simply reducing lines.

---

## 2. Why Is Code Optimization Important?

Imagine your Expense Tracker has 100 users.

Each user has 1,000 transactions.

Your application may need to retrieve and calculate information from thousands of records.

Poorly written code can cause:

- Slow dashboard loading
- Unnecessary database queries
- High memory consumption
- Slow API responses
- Increased server costs
- Poor user experience

Optimized code helps your application handle more data and users efficiently.

---

## 3. Types of Code Optimization

### 3.1 Time Optimization

Time optimization means reducing the time required for code to execute.

Example:

Unoptimized:

```python
numbers = [10, 20, 30, 40, 50]

target = 40

found = False

for number in numbers:
    if number == target:
        found = True
        break

print(found)
```

Optimized for membership checking:

```python
numbers = {10, 20, 30, 40, 50}

target = 40

print(target in numbers)
```

Why?

- A list requires sequential searching in the general case.
- A set uses hash-based lookup.
- Set membership is O(1) on average.
- List membership is O(n).

Note: Sets are useful for membership checks, but they do not preserve duplicates and are not a replacement for every list.

### 3.2 Space Optimization

Space optimization means reducing the amount of memory your program uses.

Example:

Less memory-efficient:

```python
numbers = [number for number in range(1000000)]

for number in numbers:
    print(number)
```

More memory-efficient:

```python
numbers = range(1000000)

for number in numbers:
    print(number)
```

Why?

- A list stores all generated numbers in memory.
- `range()` generates values as they are needed.
- This avoids creating a million-element list.

### 3.3 Database Optimization

Database optimization means reducing unnecessary database work and retrieving data efficiently.

Example:

Inefficient approach:

```python
transactions = db.query(Transaction).all()

for transaction in transactions:
    if transaction.amount > 1000:
        print(transaction.title)
```

Better approach:

```python
transactions = (
    db.query(Transaction)
    .filter(Transaction.amount > 1000)
    .all()
)

for transaction in transactions:
    print(transaction.title)
```

Why?

- The first approach retrieves every transaction.
- Python then filters the results.
- The second approach lets PostgreSQL filter the records.
- Only matching records are returned.

### 3.4 API Optimization

API optimization means reducing response time and unnecessary data transfer.

Example:

Less efficient:

```python
@app.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).all()
```

Better approach with pagination:

```python
@app.get("/transactions")
def get_transactions(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    return (
        db.query(Transaction)
        .offset(skip)
        .limit(limit)
        .all()
    )
```

Why?

- Returning every transaction can become expensive.
- Pagination returns a smaller number of records.
- The frontend can request additional records when needed.

---

## 4. Important Techniques for Code Optimization

### 4.1 Avoid Repeated Calculations

Unoptimized:

```python
def calculate_total(prices):
    for price in prices:
        print(sum(prices))
```

Optimized:

```python
def calculate_total(prices):
    total = sum(prices)

    for price in prices:
        print(total)
```

Why?

In the first version, `sum()` runs repeatedly.

In the second version, the total is calculated once and reused.

### 4.2 Use Appropriate Data Structures

Different data structures solve different problems.

| Data Structure | Useful For |
|---|---|
| List | Ordered collections |
| Tuple | Fixed collections |
| Set | Unique values and membership checks |
| Dictionary | Key-value lookup |
| Deque | Efficient operations at both ends |
| Heap | Priority-based operations |

Example:

Instead of repeatedly searching a list:

```python
users = ["Aman", "Rahul", "Priya"]

if "Rahul" in users:
    print("User found")
```

Use a set when frequent membership checks are required:

```python
users = {"Aman", "Rahul", "Priya"}

if "Rahul" in users:
    print("User found")
```

### 4.3 Avoid Unnecessary Loops

Unoptimized:

```python
numbers = [1, 2, 3, 4, 5]

squares = []

for number in numbers:
    squares.append(number * number)
```

Alternative:

```python
numbers = [1, 2, 3, 4, 5]

squares = [number ** 2 for number in numbers]
```

Both are valid. List comprehensions are often more concise and can be faster in Python, but readability should come first.

### 4.4 Use Functions to Avoid Duplicate Code

Unoptimized:

```python
price1 = 100
tax1 = price1 * 0.18
total1 = price1 + tax1

price2 = 200
tax2 = price2 * 0.18
total2 = price2 + tax2
```

Optimized:

```python
def calculate_total(price):
    tax = price * 0.18
    return price + tax


total1 = calculate_total(100)
total2 = calculate_total(200)
```

Benefits:

- Less duplicated code
- Easier maintenance
- Easier testing
- Consistent calculations

### 4.5 Avoid Unnecessary API Requests

Unoptimized React example:

```jsx
function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/transactions")
      .then(response => response.json())
      .then(data => setTransactions(data));
  });

  return <div>Dashboard</div>;
}
```

Problem:

There is no dependency array in `useEffect()`.

It runs after every render, potentially causing repeated API requests.

Optimized:

```jsx
function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/transactions")
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, []);

  return <div>Dashboard</div>;
}
```

The empty dependency array means the effect runs after the initial mount, rather than after every render.

---

## 5. Algorithm Optimization and Big O Notation

Algorithm optimization is one of the most important parts of writing efficient code.

Big O notation describes how an algorithm's resource requirements grow as its input size increases.

Common complexities:

| Complexity | Name | Example |
|---|---|---|
| O(1) | Constant | Dictionary lookup (average case) |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Linear search |
| O(n log n) | Linearithmic | Efficient comparison sorting |
| O(n²) | Quadratic | Two nested loops over the same input |

### Example: Linear Search vs Binary Search

Linear Search:

```python
def linear_search(numbers, target):
    for index, number in enumerate(numbers):
        if number == target:
            return index

    return -1
```

Time complexity: O(n)

Binary Search:

```python
def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left <= right:
        middle = (left + right) // 2

        if numbers[middle] == target:
            return middle

        elif numbers[middle] < target:
            left = middle + 1

        else:
            right = middle - 1

    return -1
```

Time complexity: O(log n)

Important:

Binary search requires the input to be sorted.

It is not always better to use binary search. For small or unsorted collections, linear search may be more practical.

---

## 6. Code Optimization in React

React provides tools that can help reduce unnecessary calculations and rendering work.

### 6.1 React.memo()

Prevents a component from re-rendering when its props have not changed, subject to React's shallow prop comparison.

```jsx
import React from "react";

const ExpenseCard = React.memo(function ExpenseCard({ expense }) {
  return (
    <div>
      <h3>{expense.title}</h3>
      <p>{expense.amount}</p>
    </div>
  );
});

export default ExpenseCard;
```

### 6.2 useMemo()

Caches the result of a calculation between renders while its dependencies remain unchanged.

```jsx
const totalExpenses = useMemo(() => {
  return expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
}, [expenses]);
```

### 6.3 useCallback()

Caches a function definition between renders while its dependencies remain unchanged.

```jsx
const handleDelete = useCallback((id) => {
  setExpenses(previous =>
    previous.filter(expense => expense.id !== id)
  );
}, []);
```

Important:

Do not use `memo`, `useMemo`, or `useCallback` everywhere. They have their own costs. Use them when profiling or understanding the component's behavior shows a meaningful benefit.

---

## 7. Code Optimization in FastAPI and PostgreSQL

For your Expense Tracker, consider these practices:

### Backend

- Use database filtering instead of fetching all records.
- Use pagination for large transaction lists.
- Avoid repeated database queries.
- Use appropriate database indexes.
- Validate input using Pydantic schemas.
- Keep database sessions properly managed.
- Avoid blocking operations inside asynchronous endpoints.

### PostgreSQL

- Add indexes to columns frequently used in filtering.
- Select only the columns you need.
- Avoid unnecessary joins.
- Use `EXPLAIN ANALYZE` to understand query performance.
- Use database constraints to protect data integrity.

Example index:

```sql
CREATE INDEX idx_transactions_user_id
ON transactions(user_id);
```

This can improve queries that filter transactions by `user_id`, depending on the query and data distribution.

---

## 8. Code Readability Is Also Optimization

Optimization is not only about speed.

Good code should also be:

- Easy to understand
- Easy to debug
- Easy to test
- Easy to modify
- Easy to extend

Example:

Poor naming:

```python
def calc(a, b):
    return a + b
```

Better naming:

```python
def calculate_total(amount, tax):
    return amount + tax
```

A developer should be able to understand what the code does without spending unnecessary time figuring it out.

---

## 9. How to Optimize Existing Code

Follow this practical workflow:

1. Understand what the existing code does.
2. Identify the performance or maintenance problem.
3. Measure the current behavior.
4. Find the bottleneck.
5. Choose an appropriate optimization technique.
6. Modify the code.
7. Test that the functionality has not changed.
8. Measure performance again.
9. Compare the results.
10. Keep the optimization only if it provides a meaningful benefit.

### Useful Python Profiling Tools

| Tool | Purpose |
|---|---|
| `timeit` | Measure execution time |
| `cProfile` | Profile function execution |
| `tracemalloc` | Investigate memory allocation |
| `time.perf_counter()` | Measure elapsed time |

Example using `timeit`:

```python
import timeit

code = """
total = 0

for number in range(1000):
    total += number
"""

execution_time = timeit.timeit(code, number=1000)

print("Execution time:", execution_time)
```

---

## 10. Common Code Optimization Mistakes

Avoid these mistakes:

1. Making code shorter just to call it optimized.
2. Optimizing code before understanding the problem.
3. Using complicated algorithms when simple ones are sufficient.
4. Adding unnecessary caching.
5. Ignoring memory consumption.
6. Fetching all database records when only a few are required.
7. Making unnecessary API requests.
8. Using React optimization hooks without a reason.
9. Ignoring readability and maintainability.
10. Changing code without testing its functionality.

**Remember:** Premature optimization can make code unnecessarily complicated.

---

## 11. Practical Examples for Expense Tracker

Here are some areas where you can apply optimization in your project.

| Project Feature | Optimization |
|---|---|
| Dashboard | Calculate totals efficiently |
| Transactions | Implement pagination |
| Search | Filter data efficiently |
| Categories | Avoid fetching categories repeatedly |
| Monthly Reports | Use SQL aggregation |
| PostgreSQL | Add suitable indexes |
| React Components | Avoid unnecessary rendering |
| API | Return only required fields |
| Authentication | Avoid unnecessary verification calls |
| Frontend | Avoid duplicate API requests |

Example: Calculate monthly expenses in PostgreSQL:

```sql
SELECT SUM(amount)
FROM transactions
WHERE user_id = 1
  AND kind = 'expense'
  AND transaction_date >= '2026-11-01'
  AND transaction_date < '2026-12-01';
```

This lets PostgreSQL calculate the total instead of transferring every matching transaction to Python and adding the amounts there.

---

## 12. Practice Exercises

### Beginner

1. Find the largest number in a list.
2. Remove duplicate elements using a set.
3. Calculate the sum of a list without repeatedly calling `sum()`.
4. Compare list membership and set membership.

### Intermediate

1. Implement linear search and binary search.
2. Optimize a nested-loop duplicate detection algorithm.
3. Use a dictionary to count the frequency of words.
4. Measure execution time using `timeit`.

### Expense Tracker Practice

1. Fetch only the latest 20 transactions.
2. Calculate monthly expenses using SQL aggregation.
3. Identify unnecessary API requests in a React component.
4. Find database queries that execute repeatedly.
5. Measure dashboard API response time before and after an improvement.

---

## 13. Important Terms

| Term | Meaning |
|---|---|
| Optimization | Improving code efficiency |
| Performance | How efficiently an application operates |
| Time Complexity | How execution time grows with input size |
| Space Complexity | How memory requirements grow with input size |
| Bottleneck | The part limiting overall performance |
| Profiling | Measuring where a program spends time or memory |
| Caching | Storing reusable results to avoid repeated work |
| Lazy Evaluation | Delaying computation until a value is needed |
| Refactoring | Improving code structure without changing behavior |
| Scalability | Ability to handle increasing workloads |

---

## 14. Final Summary

Code optimization is the process of improving code performance, memory usage, database operations, API responses, and maintainability.

The most important things to remember:

- Write correct code first.
- Make code readable.
- Choose suitable data structures.
- Understand Big O notation.
- Avoid repeated calculations.
- Optimize database queries.
- Reduce unnecessary API requests.
- Profile before optimizing.
- Test after making changes.

**Golden Rule:**

Do not optimize based on assumptions. Measure, identify the bottleneck, improve it, and measure again.
