def divide_numbers():
    try:
        a = float(input("Enter first number: "))
        b = float(input("Enter second number: "))

        result = a / b
        print("Result:", result)

    except ValueError:
        print("Error: Please enter valid numbers.")

    except ZeroDivisionError:
        print("Error: Cannot divide by zero.")

    finally:
        print("Division operation completed.")


divide_numbers()