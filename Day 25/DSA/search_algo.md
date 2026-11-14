# Search Algorithm Basics

## 1. What is a Searching Algorithm?

A searching algorithm is a method used to find a particular element or value from a collection of data.

The collection could be:

- An array
- A list
- A string
- A database
- A tree
- A graph

The main objective of searching is to determine whether an element exists and, if it does, find its position or retrieve its value.

### Example

Consider the following list:

```python
numbers = [10, 20, 30, 40, 50]
```

Suppose we want to search for `30`.

The searching algorithm should return its index:

```text
Target: 30
Index: 2
```

Remember that Python list indexing starts from `0`.

---

## 2. Types of Searching Algorithms

There are two fundamental searching algorithms that every beginner should understand:

1. Linear Search
2. Binary Search

Other important searching techniques include Hash-Based Search, Jump Search, Interpolation Search, and Exponential Search.

---

## 3. Linear Search

### What is Linear Search?

Linear Search is the simplest searching algorithm.

It checks each element one by one until:

- The target element is found.
- All elements have been checked.

It does not require the collection to be sorted.

### Example

Consider:

```python
numbers = [10, 20, 30, 40, 50]
target = 40
```

Searching process:

```text
Step 1: Check 10 → Not found
Step 2: Check 20 → Not found
Step 3: Check 30 → Not found
Step 4: Check 40 → Found!
```

### Python Implementation

```python
def linear_search(numbers, target):

    for index in range(len(numbers)):

        if numbers[index] == target:
            return index

    return -1


numbers = [10, 20, 30, 40, 50]

result = linear_search(numbers, 40)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")
```

Output:

```text
Element found at index: 3
```

### Time Complexity

| Case         | Time Complexity | Explanation                   |
| ------------ | --------------- | ----------------------------- |
| Best Case    | O(1)            | Target is the first element   |
| Average Case | O(n)            | Several elements are checked  |
| Worst Case   | O(n)            | Target is last or not present |

Space Complexity: O(1)

### Advantages

- Easy to understand and implement.
- Works with sorted and unsorted data.
- Does not require additional memory.
- Useful for small datasets.

### Disadvantages

- Slow for large datasets.
- May need to check every element.

---

## 4. Binary Search

### What is Binary Search?

Binary Search is an efficient searching algorithm that repeatedly divides a sorted collection into two halves.

Instead of checking every element, it eliminates half of the remaining search space in each iteration.

**Important: Binary Search requires sorted data.**

### Example

Consider:

```python
numbers = [10, 20, 30, 40, 50, 60, 70]
target = 60
```

Initially:

```text
Low = 0
High = 6
```

Calculate the middle index:

```text
Mid = (Low + High) // 2
Mid = (0 + 6) // 2
Mid = 3
```

The middle element is `40`.

Since `60 > 40`, search the right half.

Now:

```text
Low = 4
High = 6
```

Calculate the middle again:

```text
Mid = (4 + 6) // 2
Mid = 5
```

The middle element is `60`.

Target found!

### Visual Representation

```text
Original Array:

[10, 20, 30, 40, 50, 60, 70]
             |
           Middle
             40

Since 60 > 40:

[50, 60, 70]
     |
   Middle
     60

Target Found!
```

### Python Implementation (Iterative)

```python
def binary_search(numbers, target):

    low = 0
    high = len(numbers) - 1

    while low <= high:

        mid = (low + high) // 2

        if numbers[mid] == target:
            return mid

        elif numbers[mid] < target:
            low = mid + 1

        else:
            high = mid - 1

    return -1


numbers = [10, 20, 30, 40, 50, 60, 70]

result = binary_search(numbers, 60)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")
```

Output:

```text
Element found at index: 5
```

### Time Complexity

| Case         | Time Complexity | Explanation                                |
| ------------ | --------------- | ------------------------------------------ |
| Best Case    | O(1)            | Target is the middle element               |
| Average Case | O(log n)        | Search space is repeatedly halved          |
| Worst Case   | O(log n)        | Search continues until one element remains |

Space Complexity: O(1) for the iterative implementation.

### Advantages

- Very efficient for large sorted datasets.
- Eliminates half of the search space in each step.
- Requires constant extra space in its iterative implementation.

### Disadvantages

- Requires sorted data.
- Maintaining sorted data can have additional costs.
- Not directly suitable for linked lists because accessing the middle element is not constant time.

---

## 5. Binary Search Using Recursion

Binary Search can also be implemented using recursion.

Recursion means a function calls itself to solve a smaller version of the same problem.

### Python Implementation

```python
def binary_search(numbers, target, low, high):

    if low > high:
        return -1

    mid = (low + high) // 2

    if numbers[mid] == target:
        return mid

    elif numbers[mid] < target:
        return binary_search(
            numbers,
            target,
            mid + 1,
            high
        )

    else:
        return binary_search(
            numbers,
            target,
            low,
            mid - 1
        )


numbers = [10, 20, 30, 40, 50, 60, 70]

result = binary_search(
    numbers,
    60,
    0,
    len(numbers) - 1
)

print(result)
```

Output:

```text
5
```

### Complexity

- Time Complexity: O(log n)
- Auxiliary Space Complexity: O(log n) because of recursive function calls.

---

## 6. Linear Search vs Binary Search

| Feature           | Linear Search     | Binary Search                |
| ----------------- | ----------------- | ---------------------------- |
| Approach          | Checks one by one | Divides search space in half |
| Sorted Data       | Not required      | Required                     |
| Best Case         | O(1)              | O(1)                         |
| Average Case      | O(n)              | O(log n)                     |
| Worst Case        | O(n)              | O(log n)                     |
| Implementation    | Simple            | Slightly more complex        |
| Large Sorted Data | Less efficient    | More efficient               |

### Example with 1,000 Elements

For a collection of 1,000 elements:

- Linear Search may check up to 1,000 elements.
- Binary Search needs at most about 10 comparisons.

This is because:

```text
1000 → 500 → 250 → 125 → 62 → 31
     → 15 → 7 → 3 → 1
```

Binary Search significantly reduces the search space.

---

## 7. Other Important Searching Algorithms

### 7.1 Hash-Based Search

Hash-Based Search uses a hash table to locate values efficiently.

Python provides dictionaries and sets, which use hash-based data structures.

Example:

```python
expenses = {
    101: "Food",
    102: "Travel",
    103: "Shopping"
}

print(expenses[102])
```

Output:

```text
Travel
```

Average Time Complexity:

- Search: O(1)
- Insertion: O(1)
- Deletion: O(1)

Worst-case search complexity can be O(n).

**Use cases:**

- Searching users by ID.
- Finding products using unique identifiers.
- Looking up categories.
- Checking whether an item exists.

### 7.2 Jump Search

Jump Search works on sorted arrays.

Instead of checking every element, it jumps ahead by a fixed block size and then performs a linear search within the appropriate block.

Typical block size:

```text
√n
```

Time Complexity:

- Best Case: O(1)
- Average Case: O(√n)
- Worst Case: O(√n)

### 7.3 Interpolation Search

Interpolation Search estimates the likely position of the target based on the values at the beginning and end of a sorted array.

It works best when values are uniformly distributed.

Average Time Complexity: O(log log n) under suitable distribution assumptions.

Worst-case Time Complexity: O(n).

### 7.4 Exponential Search

Exponential Search finds a range that may contain the target by repeatedly doubling an index.

After finding the range, it applies Binary Search.

Time Complexity: O(log n).

It is useful for sorted collections where the size is unknown or access is available through indexed positions.

---

## 8. Searching Algorithm Complexity Summary

| Algorithm            | Best Case | Average Case   | Worst Case |
| -------------------- | --------- | -------------- | ---------- |
| Linear Search        | O(1)      | O(n)           | O(n)       |
| Binary Search        | O(1)      | O(log n)       | O(log n)   |
| Hash-Based Search    | O(1)      | O(1)           | O(n)       |
| Jump Search          | O(1)      | O(√n)          | O(√n)      |
| Interpolation Search | O(1)      | O(log log n)\* | O(n)       |
| Exponential Search   | O(1)      | O(log n)       | O(log n)   |

_Interpolation Search's average complexity assumes a suitably uniform distribution._

---

## 9. Real-World Applications

Searching algorithms are used in many applications.

### ExpenseTracker

Examples:

1. Search for an expense by transaction ID.
2. Search transactions by title.
3. Find a category by its ID.
4. Find a user by email.
5. Filter transactions by date.
6. Find expenses belonging to a particular month.

### Other Applications

- Search engines.
- Contact management systems.
- E-commerce product searches.
- Student management systems.
- Database indexing.
- File searching.
- Autocomplete systems.

**Note:** Real applications often use database indexes, specialized search structures, or full-text search instead of manually implementing Linear or Binary Search.

---

## 10. Important Python Searching Techniques

Python already provides built-in ways to search for elements.

### Using the `in` Operator

```python
numbers = [10, 20, 30, 40]

if 30 in numbers:
    print("Found")
```

### Using `index()`

```python
numbers = [10, 20, 30, 40]

position = numbers.index(30)

print(position)
```

Output:

```text
2
```

Remember: `index()` raises a `ValueError` if the element is not present.

### Using `count()`

```python
numbers = [10, 20, 30, 20, 40]

print(numbers.count(20))
```

Output:

```text
2
```

These built-in methods are useful, but understanding the algorithms behind searching is important for DSA and problem-solving.

---

## 11. Common Mistakes

### Mistake 1: Using Binary Search on Unsorted Data

Binary Search assumes the collection is sorted.

Always verify that condition before using it.

### Mistake 2: Incorrect Middle Index

Correct:

```python
mid = (low + high) // 2
```

### Mistake 3: Incorrect Loop Condition

For standard Binary Search, use:

```python
while low <= high:
```

Using `low < high` can cause the final remaining element to be skipped.

### Mistake 4: Incorrect Boundary Updates

Correct:

```python
low = mid + 1
high = mid - 1
```

This prevents the algorithm from repeatedly checking the same middle element.

### Mistake 5: Forgetting the Not-Found Case

Return `-1` when the target is not found.

---

## 12. Summary

Searching algorithms help locate elements in a collection of data.

Important concepts:

- Linear Search checks elements one by one.
- Binary Search repeatedly divides a sorted search space in half.
- Hash-Based Search uses hash tables for efficient lookups.
- Jump Search skips through sorted data in blocks.
- Interpolation Search estimates the target's position.
- Exponential Search finds a search range before applying Binary Search.

### Most Important Complexity Rules

```text
O(1)       → Constant time
O(log n)   → Logarithmic time
O(√n)      → Square-root time
O(n)       → Linear time
```
