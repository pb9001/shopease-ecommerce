import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (
      password !== formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    const savedUsers =
      localStorage.getItem("shopease_users");

    const users = savedUsers
      ? JSON.parse(savedUsers)
      : [];

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email
    );

    if (existingUser) {
      alert(
        "An account with this email already exists. Please login."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    const updatedUsers = [
      ...users,
      newUser,
    ];

    localStorage.setItem(
      "shopease_users",
      JSON.stringify(updatedUsers)
    );

    // Keep current user for profile/session
    localStorage.setItem(
      "shopease_user",
      JSON.stringify({
        name,
        email,
      })
    );

    // Automatically login the new account
    login({
      name,
      email,
    });

    alert("Account created successfully!");

    navigate("/catalogue");
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <Link
          to="/"
          className="register-logo"
        >
          ShopEase
        </Link>

        <h2>Create Account</h2>

        <p className="register-subtitle">
          Join ShopEase and start shopping today.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="name">
            Full Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">
            Password
          </label>

          <div className="password-field">

            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <div className="password-field">

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          <button
            type="submit"
            className="register-btn"
          >
            Create Account
          </button>

        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;