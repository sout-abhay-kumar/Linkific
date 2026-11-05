def length_of_longest_substring(s):
    char_index = {}
    left = 0
    max_length = 0

    for right in range(len(s)):
        char = s[right]

        # If character is already present in the current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1

        # Update the character's latest index
        char_index[char] = right

        # Calculate the current window length
        max_length = max(max_length, right - left + 1)

    return max_length


# Example
s = "abcabcbb"
print("Longest substring length:", length_of_longest_substring(s))