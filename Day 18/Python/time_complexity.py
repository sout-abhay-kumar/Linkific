# O(1)

def get_first_element(numbers):
    return numbers[0]


print(get_first_element([10, 20, 30, 40]))

# O(n)

def print_numbers(numbers):
    for number in numbers:
        print(number)


print_numbers([10, 20, 30, 40])

# O(n^2)

def print_pairs(numbers):
    for first in numbers:
        for second in numbers:
            print(first, second)


print_pairs([10, 20, 30])

# O(logn)

def binary_search(numbers, target):
    left = 0
    right = len(numbers) - 1

    while left <= right:
        middle = (left + right) // 2

        if numbers[middle] == target:
            return middle

        elif numbers[middle] < target:
            left = middle + 1

        else:
            right = middle - 1

    return -1


numbers = [10, 20, 30, 40, 50, 60, 70]

print(binary_search(numbers, 50))