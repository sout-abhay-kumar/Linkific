
def is_valid(s):
    stack = []

    pairs = {
        ")": "(",
        "}": "{",
        "]": "["
    }

    for char in s:
        if char in "({[":
            stack.append(char)

        else:
            if not stack:
                return False

            if stack[-1] != pairs[char]:
                return False

            stack.pop()

    return len(stack) == 0


# Test cases
print(is_valid("()"))       # True
print(is_valid("()[]{}"))   # True
print(is_valid("{[]}"))     # True
print(is_valid("(]"))       # False
print(is_valid("([)]"))     # False
print(is_valid("((("))      # False
