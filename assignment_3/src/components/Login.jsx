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
      // Update the current user in sessionStorage
      sessionStorage.setItem('loggedInUser', JSON.stringify(userExists));

      setLogin({
        username: '',
        password: ''
      });

      console.log('Login successful');
      navigate("/Profile");
    } else {
      console.log('Login failed');
    }
  };

  const logOutUser = () => {
    sessionStorage.removeItem('loggedInUser'); 
  } 

  const validateForm = () => {
    const newErrors = {};

    // Username
    if (
      !/^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]*$/.test(login.username)
    ) {
      newErrors.username =
        'Username can only contain English letters, numbers, and special characters.';
    }
    if (login.username.length > 60 || login.username === 0) {
      newErrors.username =
        'Username cannot be more than 60 characters and not empty';
    }

    // Password
    if (login.password.length < 7 || login.password.length > 12) {
      newErrors.password = 'Password must be between 7 and 12 characters.';
    }
    if (!/[A-Z]/.test(login.password)) {
      newErrors.password =
        'Password must contain at least one uppercase letter.';
    }
    if (!/[0-9]/.test(login.password)) {
      newErrors.password = 'Password must contain at least one number.';
    }
    if (!/[\W_]/.test(login.password)) {
      newErrors.password =
        'Password must contain at least one special character.';
    }

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <h1>User Name</h1>
        <input
          type="text"
          name="username"
          value={login.username}
          onChange={handleChange}
        />
      </div>
      {errors.username && <p>{errors.username}</p>}
      <div>
        <h1>PassWord</h1>
        <input
          type="password"
          name="password"
          value={login.password}
          onChange={handleChange}
        />
      </div>
      {errors.password && <p>{errors.password}</p>}

      <button type="submit">Login</button>
      <button onClick={()=> {logOutUser()}} >Log Out</button>
    </form>
  );
}
