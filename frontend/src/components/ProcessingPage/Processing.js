import React, { useEffect, useState, useRef } from "react";
import "./Processing.css";
import Navbar from "../HomePage/NavBar";
import { useNavigate, useLocation } from "react-router-dom";
import heroBg from "../../assets/hero_img.webp";
import logo from '../../assets/logo.png'
import { translateAudio } from "../../services/videoService";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, originalLang, targetLang, applySubtitles } = location.state;
  const [videoId] = useState(id);

  const [statusText, setStatusText] = useState("Initializing...");
  const [progress, setProgress] = useState(0);
  const channelId = useRef(uuidv4());
  const socketRef = useRef(null);

  const videoRef = useRef(null);

  // Connecting to the socket
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL, {
      transports: ["websocket"],
      withCredentials: false
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io:", socketRef.current.id);
      socketRef.current.emit("join", channelId.current);
    });

    socketRef.current.on("channel-message", (msg) => {
      console.log( msg.text);
      setStatusText(msg.text);

      const keywords = ["upload", "transcrib", "translat", "synth", "replace", "final"];
      const index = keywords.findIndex((kw) => msg.text.toLowerCase().includes(kw));
      if (index !== -1) {
        setProgress(((index + 1) / keywords.length) * 100);
      }
    });

    return () => socketRef.current.disconnect();
  }, []);

  // Triggering the translation
  useEffect(() => {
    const callTranslate = async () => {
      try {
        const payload = {
          channelId:channelId.current,
          originalLang,
          targetLang,
          applySubtitles
        }
        const res = await translateAudio(videoId, payload);
        videoRef.current = res.video; 
        setStatusText("Processing complete!");
        setProgress(100);

        setTimeout(() => {
          navigate("/download", {
            state: { video: videoRef.current, subtitles: res.subtitles },
          });
        }, 2000);
      } catch (err) {
        console.error("Translation API error:", err);
        setStatusText("An error occurred while processing the video.");
      }
    };

    if (videoId) callTranslate();
  }, []);

  const handleCancel = () => {
    socketRef.current.disconnect();
    navigate("/download", {
      state: { video: videoRef.current || null },
    });
  };

  return (
    <>
      <Navbar onFaqClick={() => {}} onProductsClick={() => {}} onTutorialClick={() => {}} />

      <div
        className="processing-page"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="processing-overlay"></div>

        <div className="processing-box">
          <div className="spinner"></div>

          <h2 className="processing-title">Processing your video...</h2>
          <p className="processing-step">{statusText}</p>

          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="d-flex align-items-center justify-content-center">
            <span className="icon-text">Powered By PixelAI</span>
            <img className="ml-2" src={logo} width={30} height={30} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProcessingPage;
