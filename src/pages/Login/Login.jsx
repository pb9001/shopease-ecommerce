import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("shopease_remembered_email") || "";
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("shopease_remember") === "true";
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your email.");
      return;
    }

    if (!cleanEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // Login using backend API
      const data = await login(cleanEmail, password);

      // Remember email
      if (rememberMe) {
        localStorage.setItem("shopease_remember", "true");
        localStorage.setItem(
          "shopease_remembered_email",
          cleanEmail
        );
      } else {
        localStorage.removeItem("shopease_remember");
        localStorage.removeItem("shopease_remembered_email");
      }

      // Redirect according to role
      if (data.user.role === "admin") {
        alert("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        alert("Login successful!");
        navigate("/catalogue");
      }
    } catch (error) {
      alert(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <Link to="/" className="login-logo">
          ShopEase
        </Link>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">
          Login to continue shopping.
        </p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="email">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">
            Password
          </label>

          <div className="password-field">

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          <div className="login-options">

            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={() =>
            alert(
              "Google login will be connected with the backend later."
            )
          }
        >
          Continue with Google
        </button>

        {/* Admin Login */}

        <button
          type="button"
          className="admin-login-option"
          onClick={() =>
            navigate("/admin/login")
          }
        >
          Login as Admin
        </button>

        <p className="register-link">
          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;