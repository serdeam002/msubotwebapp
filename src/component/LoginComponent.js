// LoginComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginComponent = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            setLoading(true);

            const response = await axios.post('https://msubotserver-edaea1829455.herokuapp.com/login', { username, password });
            const token = response.data.token;

            localStorage.setItem('token', token);
            onLogin(token);

            setLoading(false);
        } catch (error) {
            console.error('Login failed:', error.message);
            setLoading(false);
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className='d-flex'>
            <form className='container mt-5'>
                <h1 className='text-center mb-3'>Admin System</h1>
                <div className="form-outline mb-4 w-50 m-auto">
                    <input type="text" id="form1Example1" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                </div>

                <div className="form-outline mb-4 w-50 m-auto">
                    <input type="password" id="form1Example2" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                </div>
                <div className="m-auto text-center">
                    <button type="submit" onClick={handleLogin} disabled={loading} className="btn btn-primary btn-block text-center">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </form >
        </div >
    );
};

export default LoginComponent;
