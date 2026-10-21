def two_sum(nums, target):
    seen = {}  # Store each number and its index

    for i, num in enumerate(nums):  # Get index and number
        complement = target - num  # Find the number we need

        if complement in seen:  # Have we seen that number before?
            return [seen[complement], i]  # Return both indices

        seen[num] = i  # Remember this number and its index

    return []  # No matching pair found


arr = [2, 7, 11, 15]
target = 9

result = two_sum(arr, target)
print("Indices:", result)  # Output: [0, 1]