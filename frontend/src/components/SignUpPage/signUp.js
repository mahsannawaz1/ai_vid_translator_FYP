import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "./signUp.css";
import logo from "../../assets/logo.png";
import { registerUser } from "../../services/userService";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = { firstName, lastName, email, password, confirmPassword };

    try {
      const res = await registerUser(payload);

      if (res?.email) {
        navigate("/verify", {
          state: { email: res.email },
        });
      } else {
        setError("Invalid signup details. Please try again.");
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
    <div className="signup-container">
      <Link to="/" className='logo-link'>
              <img src={logo} className="auth-logo" alt="Logo" />
      </Link>
      <h1 className="hero-heading">Welcome to Pixel AI</h1>
      {error && <p className="form-error">{error}</p>}

      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label htmlFor="email">Email Address*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password*</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password*</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="btn-submit">
          Sign Up
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
