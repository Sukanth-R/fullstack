import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = ({ setUser, toggleAdminLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [userDetails, setUserDetails] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5001/admin-login', credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Set user details in state after successful login
      setUserDetails(response.data);  // This will contain the HTML content sent from the server
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed');
    }
  };

  return (
    <div>
      <header className="login-header">
        <h1>🛡️ Admin Portal</h1>
      </header>
      <div className="login-container">
        <div className="login-box">
          <div className="login-left">
            <h2>Admin Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <button type="submit" className="login-button">Sign In</button>
            </form>

            {/* Display any errors */}
            {error && <div className="error-message">{error}</div>}

            {/* Button to go back to user login */}
            <button onClick={toggleAdminLogin} className="login-button">Back to User Login</button>
          </div>
        </div>
      </div>

      {/* Render the HTML content from the backend */}
      <div dangerouslySetInnerHTML={{ __html: userDetails }} />
    </div>
  );
};

export default Admin;
