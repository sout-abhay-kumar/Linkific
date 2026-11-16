
# Optimizing Algorithm Complexity

## 1. What Is Algorithm Complexity?

Algorithm complexity describes how much time and memory an algorithm requires as the size of its input increases.

When we write a program, it is not enough for the program to produce the correct output. We should also consider how efficiently it performs.

For example, imagine you have 10,000 transactions and want to find a particular transaction.

You could:

- Check every transaction one by one.
- Use a more efficient searching technique.
- Store transactions in a dictionary for faster lookup by ID.

All three approaches may produce the same result, but their performance can be different.

**Algorithm complexity optimization means improving an algorithm so that it uses less execution time or memory while producing the same expected result.**

---

## 2. Why Is Algorithm Complexity Optimization Important?

Imagine your Expense Tracker initially has:

- 10 transactions
- 5 categories
- 2 users

Your code may perform well even if it is not very efficient.

But imagine the application grows to:

- 100,000 transactions
- 500 categories
- 10,000 users

An inefficient algorithm can become a performance problem.

Optimizing algorithm complexity helps:

1. Reduce execution time.
2. Reduce memory consumption.
3. Improve application performance.
4. Handle larger datasets.
5. Improve scalability.
6. Reduce unnecessary processing.
7. Improve user experience.

---

## 3. Understanding Time Complexity

Time complexity describes how the execution time of an algorithm grows as the input size increases.

We commonly express it using Big O notation.

### Common Time Complexities

| Complexity | Name | General Performance |
|---|---|---|
| O(1) | Constant | Excellent |
| O(log n) | Logarithmic | Very efficient |
| O(n) | Linear | Generally efficient |
| O(n log n) | Linearithmic | Efficient for many sorting algorithms |
| O(n²) | Quadratic | Can become slow |
| O(2ⁿ) | Exponential | Becomes expensive quickly |
| O(n!) | Factorial | Extremely expensive for large inputs |

Here, `n` represents the input size.

### Visual Understanding

Suppose the input size increases from 10 to 1,000 elements.

- O(1): Work remains approximately constant.
- O(log n): Work increases slowly.
- O(n): Work increases proportionally.
- O(n²): Work increases approximately with the square of input size.

The goal is generally to find an algorithm with a better growth rate when the input becomes large.

---

## 4. Understanding Different Complexities with Python

### 4.1 O(1) — Constant Time

An operation takes approximately the same amount of time regardless of the input size.

Example:

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[2])
```

Output:

```text
30
```

Why O(1)?

Python can access a list element directly using its index.

The number of elements in the list does not change the number of basic operations required for this access.

### 4.2 O(n) — Linear Time

The execution work grows proportionally with the input size.

Example:

```python
def find_number(numbers, target):
    for number in numbers:
        if number == target:
            return True

    return False


numbers = [10, 20, 30, 40, 50]

print(find_number(numbers, 40))
```

Why O(n)?

In the worst case, the algorithm checks every element.

If the list contains:

- 10 elements: Up to 10 checks.
- 100 elements: Up to 100 checks.
- 1,000 elements: Up to 1,000 checks.

Time complexity: O(n).

### 4.3 O(n²) — Quadratic Time

The amount of work can grow approximately with the square of the input size.

Example:

```python
def print_pairs(numbers):
    for first in numbers:
        for second in numbers:
            print(first, second)


numbers = [1, 2, 3, 4]
print_pairs(numbers)
```

Why O(n²)?

There are two nested loops.

For every element in the first loop, the second loop processes all elements.

If there are 4 elements:

4 × 4 = 16 operations.

If there are 100 elements:

100 × 100 = 10,000 operations.

Time complexity: O(n²).

### 4.4 O(log n) — Logarithmic Time

The input size is reduced significantly during each iteration.

Example: Binary Search.

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

Why O(log n)?

Binary search eliminates approximately half of the remaining search space in each iteration.

Important: The input list must be sorted.

### 4.5 O(n log n) — Linearithmic Time

This complexity commonly appears in efficient comparison-based sorting algorithms.

Examples:

- Merge Sort
- Heap Sort
- Average-case Quick Sort

Example:

```python
numbers = [5, 2, 8, 1, 3]

numbers.sort()

print(numbers)
```

Output:

```text
[1, 2, 3, 5, 8]
```

Python's sorting algorithm, Timsort, has O(n log n) worst-case time complexity.

---

## 5. Understanding Space Complexity

Space complexity describes how much additional memory an algorithm requires as input size increases.

Example 1: O(1) Auxiliary Space

```python
def calculate_sum(numbers):
    total = 0

    for number in numbers:
        total += number

    return total
```

The function uses a fixed number of additional variables.

Auxiliary space complexity: O(1).

Example 2: O(n) Auxiliary Space

```python
def create_squares(numbers):
    squares = []

    for number in numbers:
        squares.append(number ** 2)

    return squares
```

The new list grows with the input size.

Auxiliary space complexity: O(n).

Note: Space complexity discussions often distinguish between total space and auxiliary space. The examples above describe additional space used by the algorithm, excluding the input itself.

---

## 6. How to Optimize Algorithm Complexity

There are several common techniques.

### 6.1 Replace Nested Loops with a Hash Map

This is one of the most useful optimization techniques.

Problem: Find whether two numbers add up to a target.

Unoptimized approach:

```python
def two_sum(numbers, target):
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] + numbers[j] == target:
                return [i, j]

    return None


numbers = [2, 7, 11, 15]

print(two_sum(numbers, 9))
```

Output:

```text
[0, 1]
```

Time complexity: O(n²).

Optimized approach using a dictionary:

```python
def two_sum(numbers, target):
    seen = {}

    for index, number in enumerate(numbers):
        complement = target - number

        if complement in seen:
            return [seen[complement], index]

        seen[number] = index

    return None


numbers = [2, 7, 11, 15]

print(two_sum(numbers, 9))
```

Output:

```text
[0, 1]
```

Time complexity: O(n) average.

Space complexity: O(n).

Why is it faster?

The unoptimized algorithm checks many pairs.

The optimized algorithm stores previously encountered numbers in a dictionary and looks up the required complement.

This avoids the nested loop.

### 6.2 Use a Set for Duplicate Detection

Unoptimized:

```python
def has_duplicates(numbers):
    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] == numbers[j]:
                return True

    return False
```

Time complexity: O(n²).

Optimized:

```python
def has_duplicates(numbers):
    seen = set()

    for number in numbers:
        if number in seen:
            return True

        seen.add(number)

    return False
```

Average time complexity: O(n).

Space complexity: O(n).

Why?

A set provides average O(1) membership checking.

### 6.3 Use Binary Search Instead of Linear Search

Linear Search:

```python
def linear_search(numbers, target):
    for index, number in enumerate(numbers):
        if number == target:
            return index

    return -1
```

Time complexity: O(n).

Binary Search:

```python
def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left <= right:
        middle = (left + right) // 2

        if numbers[middle] == target:
            return middle

        if numbers[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1
```

Time complexity: O(log n).

Why?

Binary search removes half of the remaining search space in each iteration.

However, binary search requires sorted data. Sorting the data first also has a cost, so consider whether the data is already sorted or whether repeated searches justify the sorting cost.

### 6.4 Avoid Repeated Calculations

Unoptimized:

```python
def print_totals(numbers):
    for number in numbers:
        total = sum(numbers)
        print(number, total)
```

The sum is calculated repeatedly.

Optimized:

```python
def print_totals(numbers):
    total = sum(numbers)

    for number in numbers:
        print(number, total)
```

The sum is calculated once and reused.

This reduces repeated work.

### 6.5 Use Prefix Sums for Repeated Range-Sum Queries

Suppose you frequently need the sum of values between two indices.

A direct approach calculates the sum every time:

```python
def range_sum(numbers, left, right):
    return sum(numbers[left:right + 1])
```

For one query, this is fine.

For many queries, build a prefix-sum array:

```python
def build_prefix_sum(numbers):
    prefix = [0]

    for number in numbers:
        prefix.append(prefix[-1] + number)

    return prefix


def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]


numbers = [10, 20, 30, 40, 50]

prefix = build_prefix_sum(numbers)

print(range_sum(prefix, 1, 3))
```

Output:

```text
90
```

Explanation:

20 + 30 + 40 = 90.

Complexities:

- Building prefix sums: O(n).
- Each range-sum query: O(1).
- Additional space: O(n).

This is useful when there are many range-sum queries over unchanged data.

---

## 7. Common Algorithm Optimization Patterns

| Pattern | Purpose | Example |
|---|---|---|
| Hashing | Fast lookup | Two Sum |
| Two Pointers | Process sequences efficiently | Pair Sum in sorted array |
| Sliding Window | Process continuous subarrays | Maximum sum subarray of size k |
| Binary Search | Reduce search space | Search in sorted array |
| Prefix Sum | Answer repeated range queries | Range Sum |
| Sorting | Arrange data for efficient processing | Merge Intervals |
| Recursion with Memoization | Avoid repeated calculations | Fibonacci |
| Dynamic Programming | Reuse solutions to subproblems | Knapsack |
| Greedy | Make locally optimal choices | Activity Selection |

---

## 8. Understanding the Two-Pointer Technique

Two pointers are useful when working with arrays or lists.

Example: Find whether two numbers in a sorted list add up to a target.

```python
def two_sum_sorted(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]

        if current_sum == target:
            return [left, right]

        elif current_sum < target:
            left += 1

        else:
            right -= 1

    return None


numbers = [1, 2, 4, 6, 8, 9]

print(two_sum_sorted(numbers, 10))
```

Output:

```text
[1, 4]
```

Time complexity: O(n).

Space complexity: O(1).

Why?

Instead of checking every pair, we use two pointers and move one of them based on the current sum.

Important: This approach depends on the list being sorted.

---

## 9. Understanding Sliding Window

Sliding Window is useful for problems involving continuous portions of an array or string.

Example: Find the maximum sum of any 3 consecutive numbers.

```python
def maximum_sum(numbers, k):
    window_sum = sum(numbers[:k])
    max_sum = window_sum

    for i in range(k, len(numbers)):
        window_sum += numbers[i]
        window_sum -= numbers[i - k]

        max_sum = max(max_sum, window_sum)

    return max_sum


numbers = [2, 1, 5, 1, 3, 2]

print(maximum_sum(numbers, 3))
```

Output:

```text
9
```

Explanation:

The maximum window is:

5 + 1 + 3 = 9.

A naive approach calculates every window separately.

The sliding-window approach reuses the previous window's sum.

Time complexity: O(n).

Space complexity: O(1).

---

## 10. Algorithm Optimization in Your Expense Tracker

You can apply these techniques to your project.

| Feature | Possible Optimization |
|---|---|
| Search transactions | Use suitable search and database filtering |
| Find transactions by ID | Use dictionary lookup or database primary-key lookup |
| Detect duplicate records | Use sets or database constraints |
| Calculate monthly expenses | Use prefix sums or SQL aggregation, depending on the use case |
| Calculate dashboard totals | Avoid repeating the same calculations |
| Filter transactions | Apply filters before processing large datasets |
| Sort transactions | Use an efficient sorting algorithm or database ordering |
| Search categories | Use dictionaries or indexed database queries |

### Example: Calculate Total Expenses

Less efficient Python approach:

```python
def calculate_expenses(transactions):
    total = 0

    for transaction in transactions:
        if transaction["kind"] == "expense":
            total += transaction["amount"]

    return total
```

This is already O(n), which is appropriate for a single pass through an in-memory collection.

For a large database, however, you may avoid retrieving every record into Python.

Better database approach:

```sql
SELECT COALESCE(SUM(amount), 0)
FROM transactions
WHERE user_id = 1
  AND kind = 'expense';
```

PostgreSQL performs the aggregation and returns one result.

The database may use indexes and its query planner to execute this efficiently.

---

## 11. How to Analyze Algorithm Complexity

Follow these steps when analyzing an algorithm.

### Step 1: Identify the Input Size

Find the variable that represents the number of input elements.

Example:

```python
numbers = [1, 2, 3, 4, 5]
```

Here, `n` is the number of elements.

### Step 2: Count Important Operations

Look at:

- Loops
- Nested loops
- Comparisons
- Recursive calls
- Data structure operations

### Step 3: Identify the Growth Rate

Example:

```python
for number in numbers:
    print(number)
```

One loop processes n elements.

Complexity: O(n).

### Step 4: Simplify the Complexity

Example:

```python
for number in numbers:
    print(number)

for number in numbers:
    print(number)
```

The work is approximately 2n.

Big O ignores constant factors.

Therefore:

O(2n) = O(n).

### Step 5: Consider Space Complexity

Check whether the algorithm creates:

- New lists
- Dictionaries
- Sets
- Recursive call stacks
- Other data structures

### Step 6: Look for Better Approaches

Ask yourself:

- Can I avoid nested loops?
- Can I use a dictionary or set?
- Can I use two pointers?
- Can I use binary search?
- Can I reuse previous calculations?
- Can I move filtering or aggregation into the database?

---

## 12. Best, Average, and Worst Cases

An algorithm can perform differently depending on the input.

Example: Linear Search.

```python
def search(numbers, target):
    for index, number in enumerate(numbers):
        if number == target:
            return index

    return -1
```

Suppose the list contains 100 elements.

| Case | Situation | Complexity |
|---|---|---|
| Best | Target is the first element | O(1) |
| Average | Target is somewhere in the middle | O(n) |
| Worst | Target is last or absent | O(n) |

Understanding these cases helps you evaluate algorithms more accurately.

---

## 13. Measuring Actual Performance in Python

Big O describes growth rates, but actual execution time also depends on hardware, implementation, input data, and other factors.

You can use Python's `timeit` module to compare implementations.

Example:

```python
import timeit

list_code = """
numbers = list(range(100000))
99999 in numbers
"""

set_code = """
numbers = set(range(100000))
99999 in numbers
"""

list_time = timeit.timeit(list_code, number=100)
set_time = timeit.timeit(set_code, number=100)

print("List time:", list_time)
print("Set time:", set_time)
```

Important:

This example includes list/set creation in every timed run.

To compare membership operations alone, prepare the data outside the timed statements:

```python
import timeit

numbers_list = list(range(100000))
numbers_set = set(numbers_list)

list_time = timeit.timeit(
    "99999 in numbers_list",
    globals=globals(),
    number=10000
)

set_time = timeit.timeit(
    "99999 in numbers_set",
    globals=globals(),
    number=10000
)

print("List lookup:", list_time)
print("Set lookup:", set_time)
```

This gives a fairer comparison of the lookup operations.

---

## 14. Common Mistakes During Algorithm Optimization

Avoid these mistakes:

1. Optimizing code without understanding its current complexity.
2. Using complicated algorithms when a simple solution is sufficient.
3. Assuming shorter code is always faster.
4. Ignoring space complexity.
5. Using binary search on unsorted data.
6. Ignoring the cost of sorting data.
7. Using a set when duplicate values or ordering matter.
8. Optimizing based only on assumptions instead of measurements.
9. Ignoring readability and maintainability.
10. Forgetting to test edge cases after optimization.

Remember:

A faster algorithm is not always the best solution if it consumes excessive memory or makes the code unnecessarily complicated.

---

## 15. Practice Exercises

### Beginner Level

1. Find the maximum element in a list.
2. Calculate the sum of all elements.
3. Implement linear search.
4. Find duplicate elements in a list.
5. Count how many times each number appears using a dictionary.

### Intermediate Level

1. Implement binary search.
2. Solve Two Sum using a hash map.
3. Find a pair with a target sum using two pointers.
4. Find the maximum sum of a subarray of size k.
5. Implement prefix sums.
6. Compare O(n²) and O(n) duplicate detection.

### Advanced Level

1. Implement Merge Sort.
2. Solve the Merge Intervals problem.
3. Implement Fibonacci using memoization.
4. Solve a basic Dynamic Programming problem.
5. Compare different solutions using `timeit`.

---

## 16. Recommended Learning Order

Learn these topics in the following order:

1. Big O notation.
2. Time complexity.
3. Space complexity.
4. Linear Search and Binary Search.
5. Arrays and Strings.
6. Hash Maps and Sets.
7. Two Pointers.
8. Sliding Window.
9. Prefix Sums.
10. Sorting Algorithms.
11. Recursion.
12. Dynamic Programming.
13. Greedy Algorithms.

---

## 17. Final Summary

Algorithm complexity optimization means finding more efficient ways to solve programming problems.

Important points:

- Understand Big O notation.
- Analyze time and space complexity.
- Avoid unnecessary nested loops.
- Use appropriate data structures.
- Use hashing for efficient lookup.
- Apply two pointers and sliding window when appropriate.
- Use binary search on sorted data.
- Avoid repeated calculations.
- Measure performance.
- Test correctness after optimization.

**Golden Rule:**

First develop a correct solution. Then analyze its time and space complexity. Finally, look for a more efficient algorithm without sacrificing correctness or maintainability.
