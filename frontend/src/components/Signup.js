import React from 'react';
import {useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';

const Signup = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/api/signup/", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            if(response.status === 201){
                toast.success('Signup successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else{
                const data = await response.json();
                toast.error(`Signup failed: ${data.message || 'Unknown error'}`);
            }
        }
        catch(error){
            console.error('Error during signup:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <>
        <div>
            <div className='text-center mb-4'>  
            <h2><i className='fas fa-user-plus me-2'></i> Signup Page</h2>
            <p className='text-muted'>Create your account to start tracking expenses</p>
            </div>
        </div>

        <form className='p-4 rounded shadow mx-auto' style={{maxWidth: '400px'}} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className='form-label'>Full Name</label>
                <div className='input-group'>
                    <span className='input-group-text'>
                        <i className='fas fa-user'></i>
                    </span>
                    <input type='text' name='full_name' value={formData.full_name} className='form-control' onChange={handleChange} required placeholder="Enter Name"></input>
                </div>
            </div>

            <div className="mb-3">
                <label className='form-label'>Email</label>
                <div className='input-group'>
                    <span className='input-group-text'>
                        <i className='fas fa-user'></i>
                    </span>
                    <input type='text' name='email' value={formData.email} className='form-control' onChange={handleChange} required placeholder="Enter Email Address"></input>
                </div>
            </div>

            <div className="mb-3">
                <label className='form-label'>Password</label>
                <div className='input-group'>
                    <span className='input-group-text'>
                        <i className='fas fa-user'></i>
                    </span>
                    <input type='password' name='password' value={formData.password} className='form-control' onChange={handleChange} required placeholder="Create a Password"></input>
                </div>
            </div>

            <button type="submit" className='btn btn-primary w-100 mt-3'><i className='fas fa-user-plus'></i> Signup</button>
        </form>

        <ToastContainer />
        </>
    );
}

export default Signup;