import React, { useState, useRef } from "react";
import "./LoadPage.css";
import Navbar from "../HomePage/NavBar"; // Make sure path is correct
import uploadBg from "../../assets/hero_img.webp";
import { uploadVideo } from "../../services/videoService";
import { useNavigate } from "react-router-dom";
import languageOptions from "../../constants/supportedLangs";

const LoadPage = () => {
  const navigate = useNavigate()
  const [videoFile, setVideoFile] = useState(null);
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

  const handleUpload = async () => {
  if (!videoFile || !originalLang || !targetLang) {
    alert("Please select a video and both languages.");
    return;
  }

  const formData = new FormData();
  formData.append("video", videoFile);
  formData.append("originalLang", originalLang);
  formData.append("targetLang", targetLang);
  formData.append("lipSync", lipSync);
  formData.append("subtitles", subtitles);
  formData.append("speedOpt", speedOpt);
  formData.append("proofread", proofread);

  try {
    const res = await uploadVideo(formData);
    console.log("Upload successful:", res);
    if (res) {
      navigate("/processing", {
        state: {
          id: res.video._id,
          originalLang,
          targetLang,
          applySubtitles:subtitles
        },
      });
    }

  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed.");
  }
};


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
        <input
          type="file"
          accept="video/mp4,video/mov,video/webm"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        <span className="file-info">
          File type: MP4, MOV, WEBM | Max size: 500MB
        </span>
        {videoFile && (
          <span className="file-name" style={{ display: "block", marginTop: "5px", fontWeight: "bold" }}>
            {videoFile.name}
          </span>
        )}
      </label>

        <div className="dropdowns">
          <label>Original language</label>
          <select
            value={originalLang}
            onChange={(e) => setOriginalLang(e.target.value)}
          >
            <option value="">Select language</option>
            <option value="en">English</option>
            <option value="fr" disabled>French</option>
            <option value="de" disabled>German</option>
          </select>

          <label>Output language</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            <option value="">Select language</option>
              {
              languageOptions?.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))
              }
            
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

        <button className="upload-btn" onClick={handleUpload}>Translate Now</button>
      </div>
    </div>
  );
};

export default LoadPage;
