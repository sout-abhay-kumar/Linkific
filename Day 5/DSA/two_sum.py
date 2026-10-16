
def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []


arr = [2, 7, 11, 15]
target = 9

result = two_sum(arr, target)

print("Indices:", result)
