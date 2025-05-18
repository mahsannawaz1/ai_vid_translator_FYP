import React, { useState, useRef } from "react";
import "./LoadPage.css";
import Navbar from "../HomePage/NavBar"; // Make sure path is correct
import uploadBg from "../../assets/hero_img.webp";

const LoadPage = () => {
  const faqRef = useRef(null);
  const productsRef = useRef(null);
  const tutorialRef = useRef(null);

  const handleScroll = (ref) =>
    ref.current?.scrollIntoView({ behavior: "smooth" });

  const [originalLang, setOriginalLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [lipSync, setLipSync] = useState(false);
  const [subtitles, setSubtitles] = useState(false);
  const [speedOpt, setSpeedOpt] = useState(false);
  const [proofread, setProofread] = useState(true);

  return (
    <div
      className="upload-page"
      style={{ backgroundImage: `url(${uploadBg})` }}
    >
      <Navbar
        onFaqClick={() => handleScroll(faqRef)}
        onProductsClick={() => handleScroll(productsRef)}
        onTutorialClick={() => handleScroll(tutorialRef)}
      />

      <div className="upload-overlay"></div>

      <div className="upload-box">
        <h2 className="upload-title">Upload video</h2>

        <label className="upload-input-label">
          Click to upload video
          <input type="file" accept="video/mp4,video/mov,video/webm" />
          <span className="file-info">
            File type: MP4, MOV, WEBM | Max size: 500MB
          </span>
        </label>

        <div className="dropdowns">
          <label>Original language</label>
          <select
            value={originalLang}
            onChange={(e) => setOriginalLang(e.target.value)}
          >
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>

          <label>Output language</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="">Select language</option>
            <option value="es">Spanish</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>

        <div className="upload-options">
          <label>
            <span>Lip-sync</span>
            <input
              type="checkbox"
              checked={lipSync}
              onChange={() => setLipSync(!lipSync)}
            />
          </label>
          <label>
            <span>Subtitles</span>
            <input
              type="checkbox"
              checked={subtitles}
              onChange={() => setSubtitles(!subtitles)}
            />
          </label>
          <label>
            <span>Speech speed optimization</span>
            <input
              type="checkbox"
              checked={speedOpt}
              onChange={() => setSpeedOpt(!speedOpt)}
            />
          </label>
          <label>
            <span>Proofread video script</span>
            <input
              type="checkbox"
              checked={proofread}
              onChange={() => setProofread(!proofread)}
            />
          </label>
        </div>

        <button className="upload-btn">Translate Now</button>
      </div>
    </div>
  );
};

export default LoadPage;
