
def missing_number(nums):
    n = len(nums)

    expected_sum = n * (n + 1) // 2
    actual_sum = sum(nums)

    return expected_sum - actual_sum


arr = [3, 0, 1]

print("Missing number:", missing_number(arr))
