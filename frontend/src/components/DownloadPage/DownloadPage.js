import React from "react";
import "./DownloadPage.css";

function DownloadPage() {
	return (
		<div className="download-page">
			<header className="header">
				<div className="logo-container">
					<p className="powered-text">This website is powered by</p>
					<img
						src={require("../../assets/logo.png")}
						alt="Pixel AI Logo"
						className="logo"
					/>

					<p className="logo-text">PIXEL AI</p>
				</div>
			</header>
			<main className="main">
				<div className="file-preview-container">
					<div className="file-preview">
						<span className="file-name">englishtourdu.mp4</span>

						<img
							src={require("../../assets/teacher.png")}
							alt="Video thumbnail"
							className="thumbnail"
						/>
					</div>
				</div>
				<button className="download-button">Download</button>
				<p className="footer-text">
					Blockchain cryptography will make this app more secure.
				</p>
			</main>
		</div>
	);
}

export default DownloadPage;
