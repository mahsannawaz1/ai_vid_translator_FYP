import React from "react";
import "./LoadPage.css";

function LoadPage() {
	return (
		<div className="container">
			<header className="header">
				<div className="navbar">
					<div className="navbar-left">
						<span className="brand-name">PIXEL AI</span>
					</div>
					<div className="navbar-right">
						<span className="nav-item">Services</span>
						<span className="nav-item">Pricing</span>
						<span className="nav-item">Help</span>
						<span className="nav-item">About</span>
						<span className="nav-item">Login</span>
						<button className="btn-primary">Get Started Free</button>
					</div>
				</div>
			</header>

			<main className="main">
				<h1 className="title">AI Video Translator</h1>
				<p className="subtitle">
					Effortlessly translate videos with AI voices. Fast, easy, and entirely
					online.
				</p>
				<div className="options">
					<div className="option">Video from URL</div>
					<div className="option">Upload Video</div>
				</div>
				<div className="upload-box">
					<p>Click or Drag & Drop to Upload Video</p>
					<button className="btn-secondary">Translate Video Now</button>
					<p className="note">
						Supports media files of any duration, 2GB size limit only during
						trial.
						<br />
						*No credit card or account required
					</p>
				</div>
			</main>
		</div>
	);
}

export default LoadPage;

