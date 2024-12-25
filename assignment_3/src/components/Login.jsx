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
      // Assign role automatically if not already set
      if (!userExists.role) {
        userExists.role = userExists.username === 'admin' ? 'admin' : 'user';
        const updatedUsers = users.map((user) =>
          user.username === userExists.username ? userExists : user
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      // Update the current user in sessionStorage
      sessionStorage.setItem('loggedInUser', JSON.stringify(userExists));

      // *** IMPORTANT: This line tells App.js about the logged-in user ***
      props.onLogin(userExists);

      setLogin({
        username: '',
        password: ''
      });

      console.log('Login successful');

      // Navigate based on role
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
    <form className="card p-4" onSubmit={handleLogin}>
      <div className="card-body">
        <h2 className="card-title mb-4 text-center">Login</h2>
        
        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">User Name</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={login.username}
            onChange={handleChange}
          />
          {errors.username && <div className="text-danger mt-2">{errors.username}</div>}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter Password"
            name="password"
            value={login.password}
            onChange={handleChange}
          />
          {errors.password && <div className="text-danger mt-2">{errors.password}</div>}
        </div>

        {/* Submit Button */}
        {errors.general && <div className="text-danger mb-3">{errors.general}</div>}

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-20">Login</button>
        </div>
      </div>
    </form>
  );
}
