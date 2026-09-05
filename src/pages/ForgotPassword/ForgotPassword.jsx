import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!email.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage(
      "Password reset instructions have been sent to your email."
    );
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <Link to="/" className="forgot-logo">
          ShopEase
        </Link>

        <h2>Forgot Password?</h2>

        <p>
          Enter your email address and we'll help you reset
          your password.
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
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
          />

          <button type="submit">
            Send Reset Instructions
          </button>

        </form>

        {message && (
          <div className="forgot-message">
            {message}
          </div>
        )}

        <Link to="/" className="back-login">
          ← Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ForgotPassword;