def is_valid(s):
    stack = []

    pairs = {
        ")": "(",
        "}": "{",
        "]": "["
    }

    for char in s:

        # Opening bracket
        if char in "({[":
            stack.append(char)

        # Closing bracket
        else:
            if not stack:
                return False

            top = stack.pop()

            if top != pairs[char]:
                return False

    return len(stack) == 0


print(is_valid("()"))       # True
print(is_valid("()[]{}"))   # True
print(is_valid("(]"))       # False
print(is_valid("([)]"))     # False
print(is_valid("{[]}"))     # True