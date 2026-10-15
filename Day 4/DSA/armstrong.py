#  An Armstrong number is a number that is equal to the sum of its digits each raised to the power of the number of digits.
#  E.g. = 1634: 4 digits → 1^4 + 6^4 + 3^4 + 4^4 = 1634

num = int(input("Enter a number: "))

original = num
digits = len(str(num))
total = 0

if num < 0:
    print("Not an Armstrong number")
else:
    while num > 0:
        digit = num % 10
        total += digit ** digits
        num //= 10

    if total == original:
        print("Armstrong number")
    else:
        print("Not an Armstrong number")