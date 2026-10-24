def max_subarray(numbers):
    current_sum = numbers[0]
    max_sum = numbers[0]

    for i in range(1, len(numbers)):
        current_sum = max(numbers[i], current_sum + numbers[i])
        max_sum = max(max_sum, current_sum)

    return max_sum


numbers = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

result = max_subarray(numbers)

print("Maximum subarray sum:", result)