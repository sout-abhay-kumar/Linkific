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