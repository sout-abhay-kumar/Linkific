Plan Reusable UI Components
Project: ExpenseTracker – Personal Expense & Budget Manager

Objective: Design reusable React components that can be used across different pages of the application. Reusable components reduce code duplication and make the application easier to maintain.

1.  Component Folder Structure
    frontend/
    └── src/
    ├── components/
    │ ├── StatCard.jsx
    │ ├── TransactionCard.jsx
    │ ├── TransactionForm.jsx
    │ ├── BudgetCard.jsx
    │ └── CategoryBadge.jsx
    │
    ├── pages/
    │ ├── Dashboard.jsx
    │ ├── Transactions.jsx
    │ └── Budgets.jsx
    │
    ├── App.jsx
    └── main.jsx

2.  Reusable UI Components
    Component Responsibility
    StatCard.jsx Display total income, expenses, and remaining balance.
    TransactionCard.jsx Display individual income or expense transactions.
    TransactionForm.jsx Provide a reusable form to add transactions.
    BudgetCard.jsx Display budget amount, spent amount, and remaining budget.
    CategoryBadge.jsx Display transaction categories with different styles.

3.  Component Implementation
    3.1 StatCard.jsx
    Displays dashboard statistics such as total income, total expenses, and remaining balance.
    function StatCard({ title, amount, description }) {
    return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
    <h3 className="text-gray-500 text-sm">
    {title}
    </h3>

          <h2 className="text-2xl font-bold mt-2">
            ₹{amount}
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            {description}
          </p>
        </div>

    );
    }

export default StatCard;

3.2 TransactionCard.jsx
Displays transaction details such as description, category, amount, and transaction type.
function TransactionCard({ transaction }) {
const isIncome = transaction.type === "income";

return (

<div className="flex justify-between items-center p-4 border rounded-lg bg-white">
<div>
<h3 className="font-semibold">
{transaction.description}
</h3>

        <p className="text-sm text-gray-500">
          {transaction.category}
        </p>
      </div>

      <p className={`font-bold ${
        isIncome ? "text-green-600" : "text-red-600"
      }`}>
        {isIncome ? "+" : "-"}₹{transaction.amount}
      </p>
    </div>

);
}

export default TransactionCard;

3.3 TransactionForm.jsx
Provides a reusable form for adding income and expense transactions.
import { useState } from "react";

function TransactionForm({ onAddTransaction }) {
const [formData, setFormData] = useState({
description: "",
amount: "",
category: "",
type: "expense"
});

function handleChange(e) {
const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

}

function handleSubmit(e) {
e.preventDefault();

    if (
      !formData.description.trim() ||
      !formData.category ||
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      alert("Please enter valid transaction details.");
      return;
    }

    onAddTransaction({
      ...formData,
      amount: Number(formData.amount)
    });

    setFormData({
      description: "",
      amount: "",
      category: "",
      type: "expense"
    });

}

return (

<form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-xl shadow-sm border space-y-4"
    >
<h2 className="text-xl font-bold">
Add Transaction
</h2>

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        min="0.01"
        step="0.01"
        value={formData.amount}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-2 rounded-lg"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Add Transaction
      </button>
    </form>

);
}

export default TransactionForm;

3.4 BudgetCard.jsx
Displays the budget limit, amount spent, and remaining budget.
function BudgetCard({ category, budget, spent }) {
const remaining = budget - spent;

const percentage = Math.min(
(spent / budget) \* 100,
100
);

return (

<div className="bg-white p-5 rounded-xl border shadow-sm">
<h3 className="font-semibold">
{category}
</h3>

      <p className="text-sm text-gray-500 mt-2">
        Spent: ₹{spent} / ₹{budget}
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-sm mt-3">
        Remaining: ₹{remaining}
      </p>
    </div>

);
}

export default BudgetCard;

3.5 CategoryBadge.jsx
Displays transaction categories using a reusable badge.
function CategoryBadge({ category }) {
return (
<span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
{category}
</span>
);
}

export default CategoryBadge;

4. Using Reusable Components
   Example: Dashboard.jsx
   import StatCard from "../components/StatCard";
   import TransactionCard from "../components/TransactionCard";

function Dashboard() {
const transactions = [
{
id: 1,
description: "Monthly Allowance",
amount: 8000,
category: "Income",
type: "income"
},
{
id: 2,
description: "Lunch",
amount: 250,
category: "Food",
type: "expense"
}
];

return (

<div className="p-6">
<h1 className="text-3xl font-bold mb-6">
SmartSpend Dashboard
</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Income"
          amount={8000}
          description="Your total income"
        />

        <StatCard
          title="Total Expenses"
          amount={250}
          description="Your total expenses"
        />

        <StatCard
          title="Remaining Balance"
          amount={7750}
          description="Your available balance"
        />
      </div>

      <div className="mt-8 space-y-3">
        <h2 className="text-xl font-bold">
          Recent Transactions
        </h2>

        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </div>

);
}

export default Dashboard;

5. Concepts Practiced

- React functional components.
- Props and component reusability.
- useState hook.
- Controlled forms.
- Event handling.
- Conditional rendering and styling.
- Array methods such as map().
- Component-based folder organization.
- Tailwind CSS.

6. Expected Outcome
   By completing this practice, I designed reusable UI components for SmartSpend that can be used across the dashboard, transaction management, and budget management pages.

These components help reduce code duplication, improve maintainability, and maintain a consistent user interface throughout the application.
