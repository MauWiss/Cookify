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
    <div className="card p-4 mx-auto">
      <h1 className="card-title mb-4 text-center" >Edit Profile</h1>
      <form className="card-body">
        <div className="mb-3">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={form.username || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={form.firstName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={form.lastName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 ">
          <label>Email (Not Editable):</label>
          <p>{form.email}</p>
        </div>
        <div className="mb-3">
          <label>Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            className="form-control"
            value={form.birthDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>City:</label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={form.city || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Street:</label>
          <input
            type="text"
            name="street"
            className="form-control"
            value={form.street || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>House Number:</label>
          <input
            type="number"
            name="number"
            className="form-control"
            value={form.number || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Profile Image:</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
          {form.image && (
            <img
              src={form.image}
              alt="User Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
          )}
        </div>
        <button  type="button"  className="btn btn-success m-1 w-20" onClick={handleSave}>
          Save
        </button>
        <button type="button"  className="btn btn-danger  m-1 w-20" onClick={() => navigate("/Profile")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
