import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setForm(JSON.parse(loggedInUser)); // Pre-fill form with user data
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm((prevForm) => ({
          ...prevForm,
          image: event.target.result, // Store Base64 image string
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleSave = () => {
    // Retrieve all users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Update the specific user's data
    const updatedUsers = users.map((user) =>
      user.email === form.email ? form : user
    );
  
    // Save updated users back to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  
    // Update sessionStorage for the currently logged-in user
    sessionStorage.setItem("loggedInUser", JSON.stringify(form));
  
    // Redirect back to the Profile page
    navigate("/Profile");
  };
  

  return (
    <div className="editProfileBlock">
      <h1>Edit Profile</h1>
      <form>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={form.username || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={form.firstName || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email (Not Editable):</label>
          <p>{form.email}</p>
        </div>
        <div>
          <label>Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            value={form.city || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Street:</label>
          <input
            type="text"
            name="street"
            value={form.street || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>House Number:</label>
          <input
            type="number"
            name="number"
            value={form.number || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {form.image && (
            <img
              src={form.image}
              alt="User Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
          )}
        </div>
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={() => navigate("/Profile")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
