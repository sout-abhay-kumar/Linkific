
# DSA Practice – Longest Substring Without Repeating Characters

**Platform:** LeetCode  
**Problem Number:** 3  
**Difficulty:** Medium  
**Topic:** Sliding Window, Hash Set, Strings, Two Pointers  
**Language:** Python

## 1. Problem Statement

Given a string `s`, find the length of the longest substring without repeating characters.

A substring is a continuous sequence of characters within a string.

### Examples

**Example 1:**

Input:
```python
s = "abcabcbb"
```

Output:
```python
3
```

Explanation:

The longest substring without repeating characters is `"abc"`.

Its length is `3`.

**Example 2:**

Input:
```python
s = "bbbbb"
```

Output:
```python
1
```

Explanation:

The longest substring without repeating characters is `"b"`.

Its length is `1`.

**Example 3:**

Input:
```python
s = "pwwkew"
```

Output:
```python
3
```

Explanation:

The longest substring without repeating characters is `"wke"`.

Its length is `3`.

Note: `"pwke"` is not a valid answer because it is not a continuous substring.

---

## 2. Understanding the Problem

We need to find the longest continuous part of a string in which every character appears only once.

For example:

```text
s = "abcabcbb"

Possible substrings:
"a"       -> length 1
"ab"      -> length 2
"abc"     -> length 3
"abca"    -> repeated 'a', invalid
"bca"     -> length 3
"cab"     -> length 3

Longest valid substring = "abc"
Answer = 3
```

The important points are:

- A substring must contain continuous characters.
- No character should appear more than once.
- We need to return the length, not the substring itself.

---

## 3. Approach 1 – Brute Force

### Idea

Generate all possible substrings and check whether each substring contains duplicate characters.

If a substring has no repeated characters, update the maximum length.

### Code

```python
def length_of_longest_substring(s):
    max_length = 0

    for i in range(len(s)):
        seen = set()

        for j in range(i, len(s)):
            if s[j] in seen:
                break

            seen.add(s[j])

            max_length = max(
                max_length,
                j - i + 1
            )

    return max_length


s = "abcabcbb"

print(length_of_longest_substring(s))
```

Output:

```text
3
```

### Explanation

- The outer loop selects the starting position.
- The inner loop expands the substring.
- A set stores characters already encountered.
- If a character is repeated, stop expanding that substring.
- Update `max_length` whenever a longer valid substring is found.

### Complexity Analysis

- **Time Complexity:** O(n²) average time for set operations.
- **Space Complexity:** O(min(n, k)), where k is the character-set size.

This approach is easier to understand but can be inefficient for large strings.

---

## 4. Approach 2 – Sliding Window (Optimized)

### Idea

Instead of generating every possible substring, use a sliding window to maintain a valid substring.

We use two pointers:

- `left`: Starting position of the current window.
- `right`: Ending position of the current window.

We also use a set to store the characters currently inside the window.

### Algorithm

1. Initialize an empty set called `seen`.
2. Initialize `left = 0`.
3. Initialize `max_length = 0`.
4. Move the `right` pointer through the string.
5. If the current character already exists in the set:
   - Remove the character at the `left` position.
   - Move `left` one position forward.
   - Repeat until the duplicate character is removed.
6. Add the current character to the set.
7. Calculate the current window length.
8. Update the maximum length.
9. Return `max_length`.

### Python Code

```python
def length_of_longest_substring(s):
    seen = set()

    left = 0
    max_length = 0

    for right in range(len(s)):

        while s[right] in seen:
            seen.remove(s[left])
            left += 1

        seen.add(s[right])

        current_length = right - left + 1

        max_length = max(
            max_length,
            current_length
        )

    return max_length


s = "abcabcbb"

result = length_of_longest_substring(s)

print(result)
```

Output:

```text
3
```

---

## 5. Dry Run

Let's understand the optimized approach using:

```python
s = "abcabcbb"
```

| Right | Character | Current Window | Maximum Length |
|---:|---|---|---:|
| 0 | a | a | 1 |
| 1 | b | ab | 2 |
| 2 | c | abc | 3 |
| 3 | a | bca | 3 |
| 4 | b | cab | 3 |
| 5 | c | abc | 3 |
| 6 | b | cb | 3 |
| 7 | b | b | 3 |

Final Answer:

```text
3
```

The longest substring without repeating characters has length `3`.

---

## 6. Visual Understanding of Sliding Window

Consider:

```text
s = "abcabcbb"
```

Initially:

```text
a b c a b c b b
^
left
```

After processing `a`, `b`, and `c`:

```text
a b c a b c b b
^   ^
left right

Current window = "abc"
```

When the next `a` is encountered, it already exists in the window.

Move the left pointer forward and remove characters until the old `a` is removed.

```text
a b c a b c b b
  ^     ^
 left  right

Current window = "bca"
```

The window remains valid because it contains no repeated characters.

---

## 7. Complexity Analysis

Let `n` be the length of the input string.

| Complexity | Value | Explanation |
|---|---|---|
| Time | O(n) | Each character is added to and removed from the set at most once |
| Space | O(min(n, k)) | The set stores unique characters in the current window |

Here, `k` represents the size of the possible character set.

The optimized sliding-window approach is much more efficient than the brute-force approach.

---

## 8. Alternative Optimized Approach – Dictionary

We can also solve this problem using a dictionary that stores the last seen index of each character.

### Code

```python
def length_of_longest_substring(s):
    last_seen = {}

    left = 0
    max_length = 0

    for right in range(len(s)):
        char = s[right]

        if char in last_seen and last_seen[char] >= left:
            left = last_seen[char] + 1

        last_seen[char] = right

        current_length = right - left + 1

        max_length = max(
            max_length,
            current_length
        )

    return max_length


s = "pwwkew"

print(length_of_longest_substring(s))
```

Output:

```text
3
```

### Why Does This Work?

Instead of removing characters one by one, the dictionary remembers where each character last appeared.

When a duplicate is found, we move `left` directly to the position after its previous occurrence.

This also achieves:

- Time Complexity: O(n)
- Space Complexity: O(min(n, k))

---

## 9. Edge Cases

| Input | Expected Output | Reason |
|---|---:|---|
| `""` | 0 | Empty string |
| `"a"` | 1 | One character |
| `"aaaa"` | 1 | All characters repeat |
| `"abcdef"` | 6 | No repeating characters |
| `"abcabcbb"` | 3 | Repeating characters |
| `"pwwkew"` | 3 | Longest valid substring is `"wke"` |

---

## 10. Interview Explanation

If an interviewer asks me to explain my approach, I can answer:

"I solved the Longest Substring Without Repeating Characters problem using the Sliding Window technique.

First, I initialize two pointers, left and right, to represent the current substring. I also use a set to keep track of the characters inside the current window.

I move the right pointer through the string. If the current character is already present in the set, I remove characters from the left side and move the left pointer forward until the duplicate is removed.

After adding the current character, I calculate the current window length and update the maximum length.

The time complexity is O(n) because each character enters and leaves the sliding window at most once. The space complexity is O(min(n, k)) because the set stores unique characters."

---

## 11. What I Learned

- How to use the Sliding Window technique.
- How two pointers can solve string problems efficiently.
- How Python sets help detect duplicate characters.
- How dictionaries can store the last occurrence of characters.
- How to perform a dry run.
- How to compare brute-force and optimized approaches.
- How to analyze time and space complexity.
- How to explain a DSA solution during a technical interview.

## 12. Practice Questions

After understanding this problem, practice these related problems:

1. Longest Repeating Character Replacement – LeetCode 424.
2. Minimum Size Subarray Sum – LeetCode 209.
3. Permutation in String – LeetCode 567.
4. Longest Substring with At Most K Distinct Characters – related sliding-window practice.

---

## Final Summary

| Item | Details |
|---|---|
| Problem | Longest Substring Without Repeating Characters |
| Difficulty | Medium |
| Main Technique | Sliding Window |
| Data Structure | Set / Dictionary |
| Optimized Time Complexity | O(n) |
| Space Complexity | O(min(n, k)) |
| Programming Language | Python |
