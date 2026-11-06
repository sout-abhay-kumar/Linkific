from datetime import date


# Users
users = [
    {
        "id": 1,
        "name": "Rahul",
        "email": "rahul@example.com"
    }
]


# Categories
categories = [
    {
        "id": 1,
        "name": "Food",
        "type": "expense"
    },
    {
        "id": 2,
        "name": "Travel",
        "type": "expense"
    },
    {
        "id": 3,
        "name": "Salary",
        "type": "income"
    }
]


# Transactions
transactions = [
    {
        "id": 1,
        "user_id": 1,
        "category_id": 1,
        "amount": 250,
        "type": "expense",
        "description": "Lunch",
        "date": date(2026, 11, 5)
    },
    {
        "id": 2,
        "user_id": 1,
        "category_id": 2,
        "amount": 100,
        "type": "expense",
        "description": "Bus ticket",
        "date": date(2026, 11, 5)
    },
    {
        "id": 3,
        "user_id": 1,
        "category_id": 3,
        "amount": 8000,
        "type": "income",
        "description": "Monthly allowance",
        "date": date(2026, 11, 1)
    }
]


# Budgets
budgets = [
    {
        "id": 1,
        "user_id": 1,
        "category_id": 1,
        "amount": 2500,
        "month": 11,
        "year": 2026
    }
]


# Calculate total income
def calculate_income(user_id):
    return sum(
        transaction["amount"]
        for transaction in transactions
        if transaction["user_id"] == user_id
        and transaction["type"] == "income"
    )


# Calculate total expenses
def calculate_expenses(user_id):
    return sum(
        transaction["amount"]
        for transaction in transactions
        if transaction["user_id"] == user_id
        and transaction["type"] == "expense"
    )


# Calculate remaining balance
def calculate_balance(user_id):
    return calculate_income(user_id) - calculate_expenses(user_id)


# Calculate category-wise expenses
def category_wise_expenses(user_id):
    result = {}

    for transaction in transactions:
        if (
            transaction["user_id"] == user_id
            and transaction["type"] == "expense"
        ):
            category_id = transaction["category_id"]

            result[category_id] = (
                result.get(category_id, 0) + transaction["amount"]
            )

    return result


# Display results
user_id = 1

print("Total Income:", calculate_income(user_id))
print("Total Expenses:", calculate_expenses(user_id))
print("Remaining Balance:", calculate_balance(user_id))

print("Category-wise Expenses:")

for category_id, amount in category_wise_expenses(user_id).items():
    category = next(
        (cat for cat in categories if cat["id"] == category_id),
        None
    )

    if category:
        print(category["name"], ":", amount)