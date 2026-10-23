# Rotate array to the left

def rotate_left(arr, k):
    if not arr:
        return arr

    k = k % len(arr)
    return arr[k:] + arr[:k]


arr = [1, 2, 3, 4, 5]
print("Rotated array:", rotate_left(arr, 2))

# Rotate array to the right

def rotate_array(arr, k):
    if not arr:
        return arr

    k = k % len(arr)
    return arr[-k:] + arr[:-k] if k else arr


arr = [1, 2, 3, 4, 5]
k = 2

print("Rotated array:", rotate_array(arr, k))