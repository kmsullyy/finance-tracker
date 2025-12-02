import React, {useState} from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
        const [formData,setFormData] = useState({
            email: '',
            password: '',
        });
    
        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value});
        };
        
        const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch("http://127.0.0.1:8000/api/login/", {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(formData),
                    });

                    const data = await response.json();

                    if(response.status === 200){
                        toast.success('Login successful!');
                        localStorage.setItem('userId', data.userId); //Number
                        localStorage.setItem('userName', data.userName); //String

                        setTimeout(() => {
                            navigate('/dashboard');
                        }, 2000);
                    } else{
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
                <h2><i className='fas fa-user-plus me-2'></i> Login</h2>
                <p className='text-muted'>Login to Your Expense Dashboard</p>
                </div>
            </div>

            <form className='p-4 rounded shadow mx-auto' style={{maxWidth: '400px'}} onSubmit={handleSubmit}>
    
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
                        <input type='password' name='password' value={formData.password} className='form-control' onChange={handleChange} required placeholder="Enter Password"></input>
                    </div>
                </div>
    
                <button type="submit" className='btn btn-primary w-100 mt-3'><i className='fas fa-sign-in-alt me-2'></i> Login</button>
            </form>
    
            <ToastContainer />
            </>
  )
}

export default Login;
