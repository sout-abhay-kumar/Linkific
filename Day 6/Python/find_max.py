# Find a maximum number in list

arr = [10, 45, 23, 89, 12, 67]

maximum = max(arr)

print("Maximum number:", maximum)

# Using loop

arr = [10, 45, 23, 89, 12, 67]

maximum = arr[0]

for num in arr:
    if num > maximum:
        maximum = num

print("Maximum number:", maximum)