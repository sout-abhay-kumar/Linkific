def find_missing_number(arr, n):
    expected_sum = n * (n + 1) // 2
    actual_sum = sum(arr)

    return expected_sum - actual_sum


numbers = [1, 2, 4, 5]
n = 5

missing = find_missing_number(numbers, n)

print("Missing number:", missing)