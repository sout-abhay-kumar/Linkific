# Unoptimized approach - using nested loops 

def find_duplicates(numbers):
    duplicates = []

    for i in range(len(numbers)):
        for j in range(i + 1, len(numbers)):
            if numbers[i] == numbers[j] and numbers[i] not in duplicates:
                duplicates.append(numbers[i])

    return duplicates


numbers = [10, 20, 30, 20, 40, 10]
print(find_duplicates(numbers))

# Optimized approach - using a set

def find_duplicates(numbers):
    seen = set()
    duplicates = set()

    for number in numbers:
        if number in seen:
            duplicates.add(number)
        else:
            seen.add(number)

    return list(duplicates)


numbers = [10, 20, 30, 20, 40, 10]
print(find_duplicates(numbers))