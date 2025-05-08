

import React, { useState } from "react";
import "./LoadPage.css";

function LoadPage() {
  const [video, setVideo] = useState(null); // Updated state variable to match file
  const [status, setStatus] = useState(""); // To show status messages

  // Handle file input change
  const handleFileChange = (e) => {
    setVideo(e.target.files[0]); // Correct state update
  };

  // Handle video upload
  const handleUpload = async () => {
    if (!video) {
      alert("Please select a file to upload.");
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("video", video); // Correct variable name

    try {
      setStatus("Uploading...");

      // Make the fetch request and await the response
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/upload`,
        {
          method: "POST",
          body: formData, // Send the FormData object
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStatus("Upload Successful!");
        console.log("Uploaded file:", data);
      } else {
        setStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

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

          {/* Add the file input here */}
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input"
          />
          <button className="btn-secondary" onClick={handleUpload}>
            Translate Video Now
          </button>

          {/* Show upload status */}
          {status && <p className="upload-status">{status}</p>}

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
