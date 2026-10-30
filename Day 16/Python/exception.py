try:
    age = int(input("Enter your age: "))

    if age <= 0:
        print("Age must be greater than 0.")
    else:
        print("Your age is:", age)

except ValueError:
    print("Invalid input! Please enter a valid number.")