class ExpenseCRUD:

    def __init__(self):
        # Temporary storage for expenses
        self.expenses = []
        self.next_id = 1

    # CREATE - Add a new expense
    def create_expense(self, title, amount, category):

        expense = {
            "id": self.next_id,
            "title": title,
            "amount": amount,
            "category": category
        }

        self.expenses.append(expense)
        self.next_id += 1

        return expense

    # READ - Get all expenses
    def get_all_expenses(self):
        return self.expenses

    # READ - Get a single expense by ID
    def get_expense_by_id(self, expense_id):

        for expense in self.expenses:
            if expense["id"] == expense_id:
                return expense

        return None

    # UPDATE - Modify an existing expense
    def update_expense(self, expense_id, title=None, amount=None, category=None):

        for expense in self.expenses:

            if expense["id"] == expense_id:

                if title is not None:
                    expense["title"] = title

                if amount is not None:
                    expense["amount"] = amount

                if category is not None:
                    expense["category"] = category

                return expense

        return None

    # DELETE - Remove an expense
    def delete_expense(self, expense_id):

        for index, expense in enumerate(self.expenses):

            if expense["id"] == expense_id:
                deleted_expense = self.expenses.pop(index)
                return deleted_expense

        return None


# Testing the CRUD operations
if __name__ == "__main__":

    crud = ExpenseCRUD()

    # CREATE
    print("\n--- CREATE ---")
    expense1 = crud.create_expense(
        "Groceries", 1500, "Food"
    )
    expense2 = crud.create_expense(
        "Bus Ticket", 200, "Travel"
    )
    print(expense1)
    print(expense2)

    # READ ALL
    print("\n--- READ ALL ---")
    print(crud.get_all_expenses())

    # READ BY ID
    print("\n--- READ BY ID ---")
    print(crud.get_expense_by_id(1))

    # UPDATE
    print("\n--- UPDATE ---")
    updated = crud.update_expense(
        1,
        title="Monthly Groceries",
        amount=1800
    )
    print(updated)

    # DELETE
    print("\n--- DELETE ---")
    deleted = crud.delete_expense(2)
    print(deleted)

    # FINAL DATA
    print("\n--- FINAL EXPENSES ---")
    print(crud.get_all_expenses())