# Using Sum formula

def find_missing_number(numbers):
    n = len(numbers) + 1

    expected_sum = n * (n + 1) // 2
    actual_sum = sum(numbers)

    missing_number = expected_sum - actual_sum

    return missing_number


numbers = [1, 2, 4, 5, 6]

result = find_missing_number(numbers)
print("Missing number:", result)

# Using a loop 

numbers = [1, 2, 4, 5, 6]

n = len(numbers) + 1
expected_sum = n * (n + 1) // 2

actual_sum = 0

for number in numbers:
    actual_sum += number

print("Missing number:", expected_sum - actual_sum)