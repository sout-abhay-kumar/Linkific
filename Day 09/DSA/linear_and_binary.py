# Linear Search

def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i

    return -1


numbers = [10, 20, 30, 40, 50]

result = linear_search(numbers, 40)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")

    

# Binary Search


def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid

        elif arr[mid] < target:
            left = mid + 1

        else:
            right = mid - 1

    return -1


numbers = [10, 20, 30, 40, 50]

result = binary_search(numbers, 40)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")

