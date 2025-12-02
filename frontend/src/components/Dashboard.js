import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const userName = localStorage.getItem('userName'); // For displaying the name
    const userId = localStorage.getItem('userId');     // For API calls
    const [expenses, setExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        // Fetch expenses from backend API
        const fetchExpenses = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/expenses/${userId}/`);
                const data = await response.json();
                setExpenses(data);
                // Calculate total
                const total = data.reduce((sum, exp) => sum + parseFloat(exp.expense_cost), 0);
                setTotalExpense(total);
            } catch (err) {
                console.error('Error fetching expenses:', err);
            }
        };
        if (userId) fetchExpenses();
    }, [userId]);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Welcome, {userName}!</h2>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fas fa-wallet me-2"></i>Total Expenses</h5>
                            <p className="card-text fs-4">${totalExpense.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fas fa-plus me-2"></i>Add Expense</h5>
                            <Link to="/add-expense" className="btn btn-light">Add Now</Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-white bg-warning mb-3">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fas fa-tasks me-2"></i>Manage Expenses</h5>
                            <Link to="/manage-expense" className="btn btn-light">View All</Link>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className="mt-4">Recent Expenses</h4>
            <table className="table table-striped mt-2">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Item</th>
                        <th>Cost</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.length > 0 ? (
                        expenses.slice(0, 5).map((expense, index) => (
                            <tr key={expense.id}>
                                <td>{index + 1}</td>
                                <td>{expense.expense_date}</td>
                                <td>{expense.expense_item}</td>
                                <td>${parseFloat(expense.expense_cost).toFixed(2)}</td>
                                <td>{expense.note || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No expenses found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
