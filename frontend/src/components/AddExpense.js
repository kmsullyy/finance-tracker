import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AddExpense = () => {
    const navigate = useNavigate();
    const user_id = localStorage.getItem('userId'); 

    console.log('userId:', user_id);

    const [formData, setFormData] = useState({
        expense_date: '',
        expense_item: '',
        expense_cost: '',
        note: ''
    });

    // Add this useEffect to redirect if not logged in
    useEffect(() => {
        if (!user_id || user_id === 'undefined' || user_id === 'null') {
            toast.error("You must be logged in to add an expense!");
            navigate("/login");
        }
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user_id || user_id === 'undefined' || user_id === 'null') {
            toast.error("You must be logged in to add an expense!");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/expenses/add/${user_id}/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if(response.ok){
                toast.success('Expense added successfully!');
                setFormData({ expense_date: '', expense_item: '', expense_cost: '', note: '' });
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                toast.error(`Failed to add expense: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast.error('Network error. Please check your connection and try again.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Add New Expense</h2>
            <form className="p-4 rounded shadow mx-auto" style={{maxWidth: '500px'}} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input 
                        type="date" 
                        name="expense_date" 
                        value={formData.expense_date} 
                        onChange={handleChange} 
                        className="form-control" 
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Expense Item</label>
                    <input 
                        type="text" 
                        name="expense_item" 
                        value={formData.expense_item} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="e.g., Groceries"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cost</label>
                    <input 
                        type="number" 
                        name="expense_cost" 
                        value={formData.expense_cost} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="e.g., 50.00"
                        step="0.01"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Note</label>
                    <textarea 
                        name="note" 
                        value={formData.note} 
                        onChange={handleChange} 
                        className="form-control" 
                        placeholder="Optional note"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Add Expense</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AddExpense;