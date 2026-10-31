def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid  # Target found

        elif arr[mid] < target:
            left = mid + 1  # Search right half

        else:
            right = mid - 1  # Search left half

    return -1  # Target not found


numbers = [10, 20, 30, 40, 50, 60]
target = 40

result = binary_search(numbers, target)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")