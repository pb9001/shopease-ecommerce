import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // Login using backend API
      const data = await login(
        cleanEmail,
        password
      );

      // Make sure the logged-in account is actually an admin
      if (data.user.role !== "admin") {
        // Remove normal user authentication
        localStorage.removeItem("shopease_user");
        localStorage.removeItem("shopease_token");

        setError("Admin access required.");
        return;
      }

      // Admin login successful
      localStorage.setItem(
        "shopease_admin_logged_in",
        "true"
      );

      alert("Admin login successful!");

      navigate("/admin/dashboard");
    } catch (error) {
      setError(
        error.message ||
        "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <h1>ShopEase</h1>
          <p>Admin Panel</p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="admin-form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login as Admin"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;