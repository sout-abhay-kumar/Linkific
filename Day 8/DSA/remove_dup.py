# Using loop 

arr = [1, 2, 2, 3, 4, 4, 5, 1]

unique = []

for num in arr:
    if num not in unique:
        unique.append(num)

print(unique)


# Using Dictionary

arr = [1, 2, 2, 3, 4, 4, 5, 1]

unique = list(dict.fromkeys(arr)) # dict.fromkeys() preserves insertion order, 
# so this solution removes duplicates without changing the order of first appearances.

print(unique)