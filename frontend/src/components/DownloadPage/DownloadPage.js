import React from "react";
import "./DownloadPage.css";
import Navbar from "../HomePage/NavBar";
import bgImage from "../../assets/hero_img.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DownloadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { video } = location.state || {};

  if (!video) {
    return (
      
      <>
        <Navbar />
        <div className="download-page flex-column">
          
          <h2 style={{ textAlign: "center", color: "white", marginTop: "50px" }}>
            No video data found. Please try again.
          </h2>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => navigate("/")} className="download-btn purple">
              Go Back
            </button>
          </div>
        </div>
      </>
      
    );
  }

  const fileName = video.outputFileName;
  const videoUrl = `/temp/${encodeURIComponent(fileName)}`;

  return (
    <>
      <Navbar onFaqClick={() => {}} onProductsClick={() => {}} onTutorialClick={() => {}} />

      <div className="download-page" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="download-overlay"></div>

        <div className="download-box">
          <h1 className="download-title">Your video is ready!</h1>
          <p className="download-subtitle">
            Download your translated files below:
          </p>

          <div className="file-info-block">
            <p><strong>Filename:</strong> {video.outputFileName}</p>
            <p><strong>Format:</strong> MP4</p>
            <p><strong>Uploaded:</strong> {new Date(video.outputFileUploadedAt).toLocaleString()}</p>
          </div>

          <div className="download-buttons">
            <a href={videoUrl} className="download-btn purple" download>
              Download Video
            </a>
            {/* <a href={subtitleUrl} className="download-btn border" download>
              Download Subtitles
            </a>
            <a href={audioUrl} className="download-btn yellow" download>
              Download Audio Only
            </a> */}
          </div>

          <p className="footer-note">
            Didn’t get the expected result? <Link href="/upload">Try Again</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default DownloadPage;
