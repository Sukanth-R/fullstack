import React, { useState } from 'react';
import PasswordManager from './components/PasswordManager';
import Login from './components/Login';
import Admin from './components/Admin'; // Import AdminLogin component
import Signup from './components/Signup';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // New state to toggle admin login

  const toggleSignup = () => setIsSigningUp(!isSigningUp);
  const toggleAdminLogin = () => setIsAdminLogin(!isAdminLogin); // Toggle function for admin login

  return (
    <div>
      {!user ? (
        isSigningUp ? (
          <Signup setUser={setUser} toggleSignup={toggleSignup} />
        ) : isAdminLogin ? (
          <Admin setUser={setUser} toggleAdminLogin={toggleAdminLogin} /> // AdminLogin component
        ) : (
          <Login setUser={setUser} toggleSignup={toggleSignup} toggleAdminLogin={toggleAdminLogin} /> // Regular login
        )
      ) : (
        <PasswordManager user={user} />
      )}
    </div>
  );
};

export default App;
