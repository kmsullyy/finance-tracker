import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseReport = () => {
  const userId = localStorage.getItem("userId");
  const [expenses, setExpenses] = useState([]);
  const [categoryTotals, setCategoryTotals] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/expenses/${userId}/`
        );
        const data = await response.json();
        setExpenses(data);

        // GROUP BY CATEGORY
        const totals = {};
        data.forEach((expense) => {
          const category = expense.expense_item;
          const amount = parseFloat(expense.expense_cost);

          if (!totals[category]) totals[category] = 0;
          totals[category] += amount;
        });

        setCategoryTotals(totals);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [userId]);

  // Pie chart formatting
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Expense Report</h2>

      {/* Pie Chart */}
      <div className="card p-4 mb-4 shadow">
        <h4 className="text-center">Expenses by Category</h4>
        <div style={{ height: "350px" }}>
          <Pie data={pieData} />
        </div>
      </div>

      {/* Expense Table */}
      <div className="card p-4 shadow">
        <h4 className="mb-3">All Expenses</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Cost</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.expense_date}</td>
                <td>{exp.expense_item}</td>
                <td>${parseFloat(exp.expense_cost).toFixed(2)}</td>
                <td>{exp.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseReport;
