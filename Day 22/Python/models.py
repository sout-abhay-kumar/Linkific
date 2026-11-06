from datetime import date, datetime
from decimal import Decimal


class User:
    def __init__(self, user_id, name, email):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.transactions = []
        self.budgets = []


class Category:
    def __init__(self, category_id, name, category_type):
        self.category_id = category_id
        self.name = name
        self.category_type = category_type


class Transaction:
    def __init__(
        self,
        transaction_id,
        user_id,
        category_id,
        amount,
        transaction_type,
        description,
        transaction_date
    ):
        self.transaction_id = transaction_id
        self.user_id = user_id
        self.category_id = category_id
        self.amount = Decimal(str(amount))
        self.transaction_type = transaction_type
        self.description = description
        self.transaction_date = transaction_date


class Budget:
    def __init__(self, budget_id, user_id, category_id, amount, month, year):
        self.budget_id = budget_id
        self.user_id = user_id
        self.category_id = category_id
        self.amount = Decimal(str(amount))
        self.month = month
        self.year = year


# Example usage
user = User(1, "Rahul", "rahul@example.com")

food = Category(1, "Food", "expense")

transaction = Transaction(
    1,
    user.user_id,
    food.category_id,
    250,
    "expense",
    "Lunch",
    date.today()
)

budget = Budget(1, user.user_id, food.category_id, 3000, 11, 2026)

user.transactions.append(transaction)
user.budgets.append(budget)

print("User:", user.name)
print("Transaction:", transaction.description)
print("Amount:", transaction.amount)
print("Budget:", budget.amount)