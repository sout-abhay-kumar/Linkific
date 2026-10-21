def count_duplicates(numbers):
    counts = {}

    for num in numbers:
        if num in counts:
            counts[num] += 1
        else:
            counts[num] = 1

    for num, count in counts.items():
        if count > 1:
            print(f"{num} appears {count} times")


numbers = [10, 20, 30, 20, 40, 10, 20, 50]

count_duplicates(numbers)