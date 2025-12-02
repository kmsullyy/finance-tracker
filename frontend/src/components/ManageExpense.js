import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ManageExpense = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [expenses, setExpenses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        expense_date: '',
        expense_item: '',
        expense_cost: '',
        note: ''
    });

    useEffect(() => {
        if (!userId || userId === 'undefined' || userId === 'null') {
            toast.error("You must be logged in!");
            navigate("/login");
            return;
        }
        fetchExpenses();
    }, [userId, navigate]);

    const fetchExpenses = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expenses/${userId}/`);
            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            console.error('Error fetching expenses:', err);
            toast.error('Failed to load expenses');
        }
    };

    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setEditForm({
            expense_date: expense.expense_date,
            expense_item: expense.expense_item,
            expense_cost: expense.expense_cost,
            note: expense.note || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({
            expense_date: '',
            expense_item: '',
            expense_cost: '',
            note: ''
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (expenseId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expenses/update/${expenseId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Expense updated successfully!');
                setEditingId(null);
                fetchExpenses();
            } else {
                toast.error(`Failed to update: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating expense:', error);
            toast.error('Network error. Please try again.');
        }
    };

    const handleDelete = async (expenseId) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expenses/delete/${expenseId}/`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Expense deleted successfully!');
                fetchExpenses();
            } else {
                toast.error(`Failed to delete: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting expense:', error);
            toast.error('Network error. Please try again.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Manage Expenses</h2>
            
            {expenses.length === 0 ? (
                <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    No expenses found. <a href="/add-expense">Add your first expense</a>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Cost</th>
                                <th>Note</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense, index) => (
                                <tr key={expense.id}>
                                    {editingId === expense.id ? (
                                        <>
                                            <td>{index + 1}</td>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="expense_date"
                                                    value={editForm.expense_date}
                                                    onChange={handleEditChange}
                                                    className="form-control form-control-sm"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="expense_item"
                                                    value={editForm.expense_item}
                                                    onChange={handleEditChange}
                                                    className="form-control form-control-sm"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    name="expense_cost"
                                                    value={editForm.expense_cost}
                                                    onChange={handleEditChange}
                                                    className="form-control form-control-sm"
                                                    step="0.01"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="note"
                                                    value={editForm.note}
                                                    onChange={handleEditChange}
                                                    className="form-control form-control-sm"
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleUpdate(expense.id)}
                                                    className="btn btn-success btn-sm me-2"
                                                >
                                                    <i className="fas fa-check"></i> Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <i className="fas fa-times"></i> Cancel
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{index + 1}</td>
                                            <td>{expense.expense_date}</td>
                                            <td>{expense.expense_item}</td>
                                            <td>${parseFloat(expense.expense_cost).toFixed(2)}</td>
                                            <td>{expense.note || '-'}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="btn btn-warning btn-sm me-2"
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <i className="fas fa-trash"></i> Delete
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <ToastContainer />
        </div>
    );
};

export default ManageExpense;