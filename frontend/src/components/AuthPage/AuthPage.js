import React, { useState } from "react";
import "./AuthPage.css";
import logo from "../../assets/logo.png";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    console.log("User logged in:", { email });
    // Add real login logic here
  };

  return (
    <div className="auth-container">
      <img src={logo} alt="Pixel AI Logo" className="auth-logo" />
      <h1 className="hero-heading">Welcome Back to Pixel AI</h1>

      <form className="auth-form" onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-submit">
          Login
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default AuthPage;
