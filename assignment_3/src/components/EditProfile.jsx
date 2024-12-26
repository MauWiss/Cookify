import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setForm(JSON.parse(loggedInUser));
    }
    setErrors({});
  }, []);


  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm((prev) => ({
          ...prev,
          image: event.target.result, // Store Base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert file to Base64 string
    } else {
      setErrors((prev) => ({
        ...prev,
        image: "Please choose a valid JPG or JPEG file.",
      }));
    }
  };
  

  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username cannot be empty.";
    }

    if (form.password) {
      if (form.password.length < 7 || form.password.length > 12) {
        newErrors.password = "Password must be between 7 and 12 characters.";
      }
      if (!/[A-Z]/.test(form.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter.";
      }
      if (!/[0-9]/.test(form.password)) {
        newErrors.password = "Password must contain at least one number.";
      }
      if (!/[\W_]/.test(form.password)) {
        newErrors.password =
          "Password must contain at least one special character.";
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((user) =>
      user.email === form.email ? form : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    sessionStorage.setItem("loggedInUser", JSON.stringify(form));
    navigate("/Profile");
  };

  return (
    <div className="card p-4">
      <h1 className="card-title mb-4 text-center">Edit Profile</h1>
      <form className="card-body mx-auto">
        {/* Username */}
        <div className="mb-3">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            value={form.username || ""}
            onChange={handleChange}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username}</div>
          )}
        </div>

        {/* First Name */}
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

        {/* Last Name */}
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

        {/* Email (Not Editable) */}
        <div className="mb-3">
          <label>Email (Not Editable):</label>
          <p>{form.email}</p>
        </div>

        <div className="mb-3">
          <label>New Password:</label>
          <div className="input-group has-validation">
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`} // Red border if invalid
              value={form.password || ""}
              onChange={handleChange}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <div className="invalid-feedback">
                {errors.password} {/* Error message shown here */}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label>Confirm New Password:</label>
          <div className="input-group has-validation">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              className={`form-control ${
                errors.confirmPassword ? "is-invalid" : ""
              }`} // Red border if invalid
              value={form.confirmPassword || ""}
              onChange={handleChange}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? "Hide" : "Show"}
            </button>
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                {errors.confirmPassword} {/* Error message shown here */}
              </div>
            )}
          </div>
        </div>

        {/* Birth Date */}
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

        {/* City */}
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

        {/* Street */}
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

        {/* House Number */}
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

        {/* Profile Image */}
        <div className="mb-3">
          <label>Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            className={`form-control ${errors.image ? "is-invalid" : ""}`}
            onChange={handleImageChange}
          />
          {errors.image && (
            <div className="invalid-feedback">{errors.image}</div>
          )}
          {form.image && (
            <img
              src={form.image}
              alt="User Preview"
              style={{ maxWidth: "100px", marginTop: "10px" }}
            />
          )}
        </div>

        {/* Save and Cancel Buttons */}
        <button
          type="button"
          className="btn btn-success m-1 w-20"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-danger m-1 w-20"
          onClick={() => navigate("/Profile")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
