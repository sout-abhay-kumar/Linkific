def find_duplicates(numbers):
    seen = set()
    duplicates = set()

    for number in numbers:
        if number in seen:
            duplicates.add(number)
        else:
            seen.add(number)

    return list(duplicates)


numbers = [10, 20, 30, 20, 40, 10, 50]

result = find_duplicates(numbers)

print("Duplicate Elements:", result)