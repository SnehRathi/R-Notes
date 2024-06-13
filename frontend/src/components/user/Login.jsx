import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './login.css';

function Login({ loginHandler }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await loginHandler(email, password);
            setError('');
        } catch (error) {
            setError(error.message || 'An error occurred');
        }

        // Clear the password field after submission
        setPassword('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="password-container">
                    <label>Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
