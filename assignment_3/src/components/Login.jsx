import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const [login, setLogin] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({}); // Object to store errors
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If there are errors, do not submit the form
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.find(
      (user) =>
        user.username === login.username && user.password === login.password
    );

    if (userExists) {
      // Assign role automatically behind the scenes if not already set
      if (!userExists.role) {
        userExists.role = userExists.username === 'admin' ? 'admin' : 'user';
        const updatedUsers = users.map((user) =>
          user.username === userExists.username ? userExists : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      // Update the current user in sessionStorage
      sessionStorage.setItem('loggedInUser', JSON.stringify(userExists));

      setLogin({
        username: '',
        password: ''
      });

      console.log('Login successful');

      // Navigate based on the role
      if (userExists.role === "admin") {
        
        console.log("Navigating to Admin");
        navigate("/Admin");
      } else {
        console.log("Navigating to Profile");
        navigate("/Profile");
      }
    } else {
      console.log('Login failed');
      setErrors({ general: 'Invalid username or password.' });
    }
  };

  const logOutUser = () => {
    sessionStorage.removeItem('loggedInUser');
    console.log('User logged out successfully.');
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!login.username.trim()) {
      newErrors.username = 'Username is required.';
    }

    // Validate password
    if (!login.password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <h1>Username</h1>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={login.username}
          onChange={handleChange}
        />
      </div>
      {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}

      <div>
        <h1>Password</h1>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={login.password}
          onChange={handleChange}
        />
      </div>
      {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

      <button type="submit">Login</button>
      <button type="button" onClick={logOutUser}>
        Log Out
      </button>
    </form>
  );
}
