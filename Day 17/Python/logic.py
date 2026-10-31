# Logical errors
# def second_largest(numbers):
#     numbers.sort()
#     return numbers[-2]


# numbers = [10, 20, 20, 30]

# print(second_largest(numbers))

# Correct one

def second_largest(numbers):
    unique_numbers = list(set(numbers))

    if len(unique_numbers) < 2:
        return None

    unique_numbers.sort(reverse=True)

    return unique_numbers[1]


numbers = [10, 20, 20, 30]

print("Second Largest:", second_largest(numbers))