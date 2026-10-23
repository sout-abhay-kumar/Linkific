
def missing_number(nums):
    n = len(nums) # n = 3

    expected_sum = n * (n + 1) // 2  # expected_sum = 6
    actual_sum = sum(nums) # actual_sum = 4

    return expected_sum - actual_sum # 6 - 4 = 2


arr = [3, 0, 1]

print("Missing number:", missing_number(arr)) # so, missing number is 2 and time complexity is O(n)
