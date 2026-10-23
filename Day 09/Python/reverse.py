# Using slicing

numbers = [10, 20, 30, 40, 50]

reversed_numbers = numbers[::-1]

print(reversed_numbers)

# Using reverse() method

numbers = [10, 20, 30, 40, 50]

numbers.reverse()

print(numbers)

# By using two pointers method

numbers = [10, 20, 30, 40, 50]

left = 0
right = len(numbers) - 1

while left < right:
    numbers[left], numbers[right] = numbers[right], numbers[left]

    left += 1
    right -= 1

print(numbers)