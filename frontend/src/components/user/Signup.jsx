import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './signup.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const userData = {
            username,
            email,
            password
        };

        try {
            const response = await axios.post('http://localhost:3000/api/auth/signup', userData);
            setMessage('User created successfully');
            setError('');
            window.location.href = '/';
        } catch (error) {
            setError(error.response.data.message || 'An error occurred');
        }

        // Clear the form after successful submission
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="signup-container">
            <h2>Signup</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <div className="password-container">
                    <label>Confirm Password:</label>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}

export default Signup;
