def isAnagram(s, t):
    if len(s) != len(t):
        return False

    return sorted(s) == sorted(t)


# Example
s = "listen"
t = "silent"

if isAnagram(s, t):
    print("Valid Anagram")
else:
    print("Not a Valid Anagram")