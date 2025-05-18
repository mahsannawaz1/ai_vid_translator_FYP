import React, { useEffect, useState, useRef } from "react";
import "./Processing.css";
import Navbar from "../HomePage/NavBar";
import { useNavigate } from "react-router-dom";
import heroBg from "../../assets/hero_img.webp";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const [statusIndex, setStatusIndex] = useState(0);
  const statusSteps = [
    "Uploading file...",
    "Transcribing audio...",
    "Translating subtitles...",
    "Rendering video...",
    "Finalizing...",
  ];

  const intervalRef = useRef(null);

  // Progress simulation
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStatusIndex((prev) => {
        if (prev < statusSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(intervalRef.current);
          // Redirect after last step
          setTimeout(() => navigate("/download"), 1500);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  const handleCancel = () => {
    clearInterval(intervalRef.current); // Stop animation
    navigate("/download"); // Redirect
  };

  return (
    <>
      <Navbar
        onFaqClick={() => {}}
        onProductsClick={() => {}}
        onTutorialClick={() => {}}
      />

      <div
        className="processing-page"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="processing-overlay"></div>

        <div className="processing-box">
          <div className="spinner"></div>

          <h2 className="processing-title">Processing your video...</h2>
          <p className="processing-step">{statusSteps[statusIndex]}</p>

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((statusIndex + 1) / statusSteps.length) * 100}%`,
              }}
            ></div>
          </div>

          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ProcessingPage;
