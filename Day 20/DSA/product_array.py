def product_except_self(nums):
    n = len(nums)
    result = [1] * n

    # Calculate prefix products
    prefix = 1

    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]

    # Calculate suffix products
    suffix = 1

    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]

    return result


arr = [1, 2, 3, 4]

print("Product Array:", product_except_self(arr))