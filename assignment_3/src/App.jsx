// App.js
import { useState} from "react";
import {Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  const [users, setUsers] = useState([]);

  const handleRegister = (newUser) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers)); // שומר את המשתמשים ב-localStorage
      return updatedUsers;
    });
  };
  
  return (
    
    <div>
      <nav>
      <Link to="/Register">Register</Link> || <Link to="/Login">Login</Link> || <Link to="/Profile">Profile</Link>
    </nav>
      <h1>User Management System</h1>
      <Routes>
      <Route path='/Register' element= {<Register onRegister={handleRegister} />}/>
      <Route path='/Login' element= {<Login/>}/>
      <Route path='/Profile' element= {<Profile/>}/>
      </Routes> 
      <div className="overlay"></div>
    </div>
  );
}

export default App;
