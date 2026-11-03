def maximum_subarray(arr):
    max_sum = arr[0]
    start = 0
    end = 0

    for i in range(len(arr)):
        current_sum = 0

        for j in range(i, len(arr)):
            current_sum += arr[j]

            if current_sum > max_sum:
                max_sum = current_sum
                start = i
                end = j

    return max_sum, arr[start:end + 1]


arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

max_sum, subarray = maximum_subarray(arr)

print("Maximum Subarray:", subarray)
print("Maximum Sum:", max_sum)