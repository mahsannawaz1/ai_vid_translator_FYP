import React, { useState } from "react";
import "./AuthPage.css";
import logo from "../../assets/logo.png";
import { loginUser } from "../../services/userService";
import { Link, useNavigate } from "react-router-dom";

const AuthPage = ({setAuthToken}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const payload = { email, password };
      const res = await loginUser(payload);

      if (res?.data?.Authorization) {
        const token = res.data.Authorization;
        localStorage.setItem("x-auth-token", token);
        setAuthToken(token);
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (Array.isArray(err?.response?.data?.errors) &&
          err.response.data.errors[0]);

      setError(apiMessage || "Something went wrong. Please try again.");
    }

  };

  return (
    <div className="auth-container">
      <Link to="/" className='logo-link'>
              <img src={logo} className="auth-logo" alt="Logo" />
      </Link>
      <h1 className="hero-heading">Welcome Back to Pixel AI</h1>
      {error && <p className="form-error">{error}</p>}

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
