def merge_sorted_arrays(arr1, arr2):
    i = 0
    j = 0
    merged = []

    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            merged.append(arr1[i])
            i += 1
        else:
            merged.append(arr2[j])
            j += 1

    # Add remaining elements from arr1
    while i < len(arr1):
        merged.append(arr1[i])
        i += 1

    # Add remaining elements from arr2
    while j < len(arr2):
        merged.append(arr2[j])
        j += 1

    return merged


arr1 = [1, 3, 5, 7]
arr2 = [2, 4, 6, 8]

result = merge_sorted_arrays(arr1, arr2)

print("Merged Array:", result)