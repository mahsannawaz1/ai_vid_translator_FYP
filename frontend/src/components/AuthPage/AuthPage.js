import React, { useState } from "react";
import "./AuthPage.css";
import "font-awesome/css/font-awesome.min.css";


const AuthPage = () => {
	const [isLogin, setIsLogin] = useState(true);

	const handleFormSubmit = (e) => {
		e.preventDefault();
		// Handle form submission logic here
	};

	return (
		<div className="auth-page">
			<div className="form-container">
				<h1>Welcome to Pixel AI</h1>

				<div className="auth-buttons">
					<button className="google-btn">Join with Google</button>
					<button className="apple-btn">Join with Apple</button>
				</div>

				<p className="or-text">or</p>

				<form onSubmit={handleFormSubmit} className="login-form">
					<div className="input-field">
						{/* <label htmlFor="email">Email</label> */}
						<input type="email" id="email" placeholder="Email" required />
					</div>

					<div className="input-field">
						{/* <label htmlFor="password">Password</label> */}
						<input
							type="password"
							id="password"
							placeholder="Password"
							required
						/>
					</div>

					<div className="forgot-password">
						<a href="#">Forgot Password?</a>
					</div>

					<button type="submit" className="login-btn">
						{isLogin ? "Login" : "Sign Up"}
					</button>
				</form>

				<p className="signup-text">
					{isLogin ? "Don't have an account?" : "Already have an account?"}
					<button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
						{isLogin ? "Sign Up" : "Login"}
					</button>
				</p>

				<hr />
				<div className="privacy-policy">
					<a href="#">Privacy Policy</a>
				</div>
			</div>

			<div className="second-section">
				<h2>Idea to YouTube Video</h2>
				<p>
					With Pixel AI, you can turn any content or idea into video, instantly.
				</p>

				<div className="image-container">
					<img src={require("../../assets/image.png")} alt="Pixel AI Demo" />
				</div>
			</div>
		</div>
	);
};

export default AuthPage;
