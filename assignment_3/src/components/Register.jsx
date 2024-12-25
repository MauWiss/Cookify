import React, { useState } from "react";

function Register({ onRegister }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    image: null,
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    city: "",
    street: "",
    number: "",
  });

  const [errors, setErrors] = useState({}); // Object to store errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        image: "Please choose a JPG or JPEG file only",
      }));
    }
  };
  

  const validateForm = () => {
    const newErrors = {};

    // Username
    if (
      !/^[A-Za-z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]*$/.test(form.username)
    ) {
      newErrors.username =
        "Username can only contain English letters, numbers, and special characters.";
    }
    if (form.username.length > 60) {
      newErrors.username = "Username cannot be more than 60 characters.";
    }

    // Password
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

    // Confirm Password
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Password and Confirm Password do not match.";
    }

    // Email
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(form.email)) {
      newErrors.email = "Email address is not valid.";
    }

    // Birth Date
    if (new Date(form.birthDate) >= new Date() || 120 >= (new Date().getFullYear - new Date(form.birthDate).getFullYear) || 18 <=(new Date().getFullYear - new Date(form.birthDate).getFullYear) ) {
      newErrors.birthDate = "Birth date cannot be in the future.";
    }

    // City
    if (!form.city) {
      newErrors.city = "City is required.";
    }

    // Number (must be positive)
    if (form.number && form.number < 0) {
      newErrors.number = "Number cannot be negative.";
    }

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If there are errors, do not submit the form
    }

    // If no errors, submit the form
    onRegister({ ...form });
    setForm({
      username: "",
      password: "",
      confirmPassword: "",
      image: null,
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      city: "",
      street: "",
      number: "",
    }); // Reset the form
  };

  return (
    <div>
      <form className="card p-4" onSubmit={handleSubmit}>
        <div className="card-body">
        <h2 className="card-title mb-4 text-center" >Register</h2>

        <input
          type="text"
          className="form-control"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        {errors.username && <p>{errors.username}</p>}

        <input
          type="password"
          className="form-control"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <p>{errors.password}</p>}

        <input
          type="password"
          className="form-control"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}



        <input type="file" className="form-control"  name="image" onChange={handleImageChange} />
        {errors.image && <p>{errors.image}</p>}

        <input
          type="text"
          className="form-control"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          className="form-control"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
        />

        <input
          type="email"
          className="form-control"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <p>{errors.email}</p>}

        <input
          type="date"
          className="form-control"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
        />
        {errors.birthDate && <p>{errors.birthDate}</p>}

        <input
          type="text"
          className="form-control"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        {errors.city && <p>{errors.city}</p>}

        <input
          type="text"
          className="form-control"
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
        />

        <input
          type="number"
          className="form-control"
          name="number"
          placeholder="Number"
          value={form.number}
          onChange={handleChange}
        />
        {errors.number && <p>{errors.number}</p>}

        <button type="submit" className="btn btn-primary w-20">Register</button>
        </div>
      </form>
    </div>
  );
}

export default Register;
