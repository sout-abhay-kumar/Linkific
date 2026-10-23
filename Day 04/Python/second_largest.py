arr = [10, 25, 5, 40, 30, 40]

unique_numbers = list(set(arr))
unique_numbers.sort(reverse=True)

if len(unique_numbers) >= 2:
    print("Second largest number:", unique_numbers[1])
else:
    print("Second largest number does not exist")