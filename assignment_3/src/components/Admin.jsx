import React, { useState, useEffect } from "react";

function Admin() {
  const [users, setUsers] = useState([]);

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = storedUsers.map(user => ({
      username: user.username || "N/A",
      password: user.password || "N/A",
      confirmPassword: user.confirmPassword || "N/A",
      image: user.image || null,
      firstName: user.firstName || "N/A",
      lastName: user.lastName || "N/A",
      email: user.email || "N/A",
      birthDate: user.birthDate || "N/A",
      city: user.city || "N/A",
      street: user.street || "N/A",
      number: user.number || "N/A",
    }));
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  }, []);

  const handleEdit = (index) => {
    const userToEdit = users[index];
    const newUsername = prompt("Enter new username:", userToEdit.username);
    const newFirstName = prompt("Enter new first name:", userToEdit.firstName);
    const newLastName = prompt("Enter new last name:", userToEdit.lastName);
    const newEmail = prompt("Enter new email:", userToEdit.email);
    const newCity = prompt("Enter new city:", userToEdit.city);
    const newStreet = prompt("Enter new street:", userToEdit.street);
    const newNumber = prompt("Enter new house number:", userToEdit.number);
    const newBirthDate = prompt("Enter new birth date:", userToEdit.birthDate);

    if (newUsername && newFirstName && newLastName && newEmail && newCity && newStreet && newNumber && newBirthDate) {
      const updatedUsers = [...users];
      updatedUsers[index] = {
        ...updatedUsers[index],
        username: newUsername,
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        city: newCity,
        street: newStreet,
        number: newNumber,
        birthDate: newBirthDate,
      };
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert("User updated successfully.");
    }
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert("User deleted successfully.");
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Panel</h1>
      <table border="1" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px" }}>#</th>
            <th style={{ padding: "10px" }}>Profile Picture</th>
            <th style={{ padding: "10px" }}>Username</th>
            <th style={{ padding: "10px" }}>Full Name</th>
            <th style={{ padding: "10px" }}>Birth Date</th>
            <th style={{ padding: "10px" }}>Address</th>
            <th style={{ padding: "10px" }}>Email</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{index + 1}</td>
              <td style={{ padding: "10px" }}>
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td style={{ padding: "10px" }}>{user.username}</td>
              <td style={{ padding: "10px" }}>{`${user.firstName} ${user.lastName}`}</td>
              <td style={{ padding: "10px" }}>{user.birthDate}</td>
              <td style={{ padding: "10px" }}>{`${user.street} ${user.number}, ${user.city}`}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
              <td style={{ padding: "10px" }}>
                <button style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }} onClick={() => handleEdit(index)}>Edit</button>
                <button style={{ padding: "5px 10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }} onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
