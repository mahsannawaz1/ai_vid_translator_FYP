import React from "react";
import "./DownloadPage.css";
import Navbar from "../HomePage/NavBar";
import bgImage from "../../assets/hero_img.webp"; // Reusing same background

const DownloadPage = () => {
  return (
    <>
      <Navbar
        onFaqClick={() => {}}
        onProductsClick={() => {}}
        onTutorialClick={() => {}}
      />

      <div
        className="download-page"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="download-overlay"></div>

        <div className="download-box">
          <h1 className="download-title">Your video is ready!</h1>
          <p className="download-subtitle">
            Download your translated files below:
          </p>

          <div className="file-info-block">
            <p>
              <strong>Filename:</strong> translated_video.mp4
            </p>
            <p>
              <strong>Size:</strong> 120MB
            </p>
            <p>
              <strong>Format:</strong> MP4
            </p>
          </div>

          <div className="download-buttons">
            <a href="#" className="download-btn purple">
              Download Video
            </a>
            <a href="#" className="download-btn border">
              Download Subtitles
            </a>
            <a href="#" className="download-btn yellow">
              Download Audio Only
            </a>
          </div>

          <p className="footer-note">
            Didn’t get the expected result? <a href="#">Try Again</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default DownloadPage;
