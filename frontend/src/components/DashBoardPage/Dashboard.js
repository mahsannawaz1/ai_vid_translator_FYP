import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "../HomePage/NavBar";
import heroBg from "../../assets/hero_img.webp";
import { dashboardDetails, extractSubtitles, getFile, msToSrtTime } from "../../services/videoService";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [videos, setVideos] = useState([])
    const [currentVideo,setCurrentVideo] = useState({})
    const [currentSubtitles,setCurrentSubtitles] = useState([])
    const [currentTab,setCurrentTab] = useState("Translated")
    
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await dashboardDetails();
                console.log(res)
                if(res.data && res.data.length > 0){
                    setCurrentVideo(res.data[0])
                    handleExtractSubtitles(res.data[0].subtitles[0].outputFilePath)
                    setVideos(res.data)
                } 
            } catch (err) {
                console.error("Failed to fetch videos and subtitles:", err);
            }
        };
        fetchVideos();
    }, []);
    const handleExtractSubtitles = async (filePath)=>{
        const res = await extractSubtitles(filePath)
        setCurrentSubtitles(res)
    }

    useEffect(()=>{
        let filePath = "";
        if(currentVideo?._id && currentTab == "Original"  ){
            filePath = currentVideo.subtitles[0].filePath
            handleExtractSubtitles(filePath)
        }
            
        else if(currentVideo?._id && currentTab == "Translated"){
            filePath = currentVideo.subtitles[0].outputFilePath
            handleExtractSubtitles(filePath)
        }
            
        
    },[currentTab,currentVideo])
    
    return (
        <>
        <Navbar
            onFaqClick={() => {}}
            onProductsClick={() => {}}
            onTutorialClick={() => {}}
        />

        {videos && videos.length > 0 ? <div
            className="dashboard-page"
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            <div className="dashboard-overlay"></div>

            <div className="dashboard-wrapper">
            {/* Sidebar for captions */}
            <div className="sidebar">
                <div className="language-bar">
                <span className="flag text-uppercase"> {currentVideo.sourceLang} - {currentVideo.targetLang}</span> 
                {/* <button className="add-lang">+ New language</button> */}
                </div>

                <div className="captions">
                {currentSubtitles.map((subtitle, index) => (
                    <div className="caption" key={index}>
                    <span className="timestamp">{msToSrtTime(subtitle.startTime)} -- {msToSrtTime(subtitle.endTime)}</span>
                    <span className="text">{subtitle.text}</span>
                    </div>
                ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="tabs">
                <button className={`tab ${currentTab === "Original" ? "active" : ""}`} onClick={()=>setCurrentTab("Original")}>Original</button>
                <button className={`tab ${currentTab === "Translated" ? "active" : ""}`} onClick={()=>setCurrentTab("Translated")}>Translated</button>
                {/* <button className="tab">Lip-synced</button> */}
                </div>

                <div className="video-display">
                    {currentTab === "Translated" ? 
                        (currentVideo.outputFilePath && 
                        <>
                            <video
                            key={currentVideo.outputFilePath}
                            className="w-100"
                            controls
                            height="400"
                            >
                            <source src={getFile(currentVideo.outputFilePath)} type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>
                        </>
                        )
                        :
                        (currentVideo.filePath && 
                        <>
                            <video
                            key={currentVideo.filePath}
                            className="w-100"
                            controls
                            height="400"
                            >
                            <source src={getFile(currentVideo.filePath)} type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>
                        </>
                        )
                    }
                </div>

                <div className="translated-videos">
                <h3>Other translated videos</h3>
                <div className="video-list">
                    {videos?.map((video, i) => 
                        <div
                        onClick={()=>{
                            console.log("Hello")
                            setCurrentVideo(video)
                        }} 
                        className="video-item cursor-pointer" style={{background: currentVideo._id === video._id ? "purple" : ""}} key={i}>
                            <img src={getFile(video.thumbnailPath)} alt={"thumbnail"} />
                            <div className="video-info">
                                <span>{video.outputFileUploadedAt}</span>
                                <span className="text-uppercase">{video.sourceLang}-{video.targetLang}</span>
                            </div>
                        </div>                 
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        :
        <div className="d-flex flex-column align-items-center justify-content-center no-videos-div">
            <h3 className="text-center text-capitalize">You haven't uploaded any videos yet.</h3>
            <Link to="/translate" className="translate-btn">Upload Now</Link>
        </div>
        }
        </>
    );
};

export default Dashboard;