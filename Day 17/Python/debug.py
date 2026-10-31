# def calculate_average(numbers): #Incorrect code
#     total = 0

#     for num in numbers:
#         total += num

#     average = total / len(numbers) - 1

#     return average


# numbers = [10, 20, 30, 40, 50]

# print("Average:", calculate_average(numbers))


def calculate_average(numbers):
    if not numbers:
        return 0

    total = 0

    for num in numbers:
        total += num

    average = total / len(numbers)

    return average


numbers = [10, 20, 30, 40, 50]

print("Average:", calculate_average(numbers))