import React from "react";
import "./VideoPage.css";

function VideoPage() {
	return (
		<div className="video-page">
			<header className="header">
				<div className="logo-container">
					<p className="powered-text">This website is powered by</p>
					{/* You can add the image path accordingly */}
					<img
						src={require("../../assets/logo.png")}
						alt="Pixel AI Logo"
						className="logo"
					/>

					<p className="logo-text">PIXEL AI</p>
				</div>
			</header>
			<main className="main">
				<div className="progress-bar"></div>
				<h1 className="status-text">Translation in Process...</h1>
				<button className="cancel-button">Cancel</button>
				<p className="footer-text">
					Blockchain cryptography will make this app more secure.
				</p>
			</main>
		</div>
	);
}

export default VideoPage;
