import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({updateRole}) {
    const [formData, setFormData] = useState({ emailid: '', password: '' });
    const [error, setError] = useState('');

    let navigate = useNavigate()
    const fields = [
        {
            type: 'email',
            name: 'emailid',
            placeholder: 'Please Enter Your Emailid'
        },
        {
            type: 'password',
            name: 'password',
            placeholder: 'Please Enter Your Password'
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const response = await fetch('http://localhost:5000/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        navigate('/')
        
        if (response.status != 200) {
            alert(result.message)
        }
        else{
            localStorage.setItem("token",result.token)
            localStorage.setItem("role",result.role)
            updateRole(result.role)
        }

        // localStorage.setItem('emailid', formData.emailid)
        // localStorage.setItem('password', formData.password)
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    {fields.map((field, index) => (
                        <div className="mb-3" key={index}>
                            <label htmlFor={field.name} className="form-label">
                                {field.name === 'emailid' ? 'Email ID' : 'Password'}
                            </label>
                            <input
                                type={field.type}
                                className="form-control"
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {error && <div className="alert alert-danger py-1">{error}</div>}

                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
