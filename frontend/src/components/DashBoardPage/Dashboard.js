import React from "react";
import "./Dashboard.css";
import Navbar from "../HomePage/NavBar";
import heroBg from "../../assets/hero_img.webp";
// import sampleThumb from "../../assets/sample_thumb.jpg"; // use any dummy thumbnail

const Dashboard = () => {
    return (
        <>
        <Navbar
            onFaqClick={() => {}}
            onProductsClick={() => {}}
            onTutorialClick={() => {}}
        />

        <div
            className="dashboard-page"
            style={{ backgroundImage: `url${(heroBg)}` }}
        >
            <div className="dashboard-overlay"></div>

            <div className="dashboard-wrapper">
            {/* Sidebar for captions */}
            <div className="sidebar">
                <div className="language-bar">
                <span className="flag">🇬🇧</span> EN - UK
                {/* <button className="add-lang">+ New language</button> */}
                </div>

                <div className="captions">
                {[
                    "we have seen the growing trend of physical games less and less popular,",
                    "there is a lot cost associated with it",
                    "as time has progressed that",
                    "there is a huge difference between digital copy of the game and physical copy of the game",
                    "People love to play games.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                    "E-sports is very common among people.",
                ].map((line, index) => (
                    <div className="caption" key={index}>
                    <span className="timestamp">-00:00:{(index + 1) * 6}</span>
                    <span className="text">{line}</span>
                    {/* <span className="options">⋯</span> */}
                    </div>
                ))}
                </div>

                {/* <div className="timeline"> */}
                {/* <div className="time-track">
                    {/* <span>00:00:15,000</span> */}
                    {/* <span>00:00:25,000</span> */}
                    {/* <span>00:00:35,000</span> */}
                {/* </div> */} 
                {/* </div> */}
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="tabs">
                <button className="tab">Original</button>
                <button className="tab active">Translated</button>
                {/* <button className="tab">Lip-synced</button> */}
                </div>

                <div className="video-display">
                <img src={""} alt="Video thumbnail" />
                </div>

                <div className="translated-videos">
                <h3>Other translated videos</h3>
                <div className="video-list">
                    {[1, 2, 3,4,5,6,7,8].map((v, i) => (
                    <div className="video-item" key={i}>
                        <img src={""} alt="thumb" />
                        <div className="video-info">
                        <span>2025-05-{20 - i}</span>
                        <span>{[23, 5, 89][i]}MB</span>
                        <span>{["EN→HI", "HI→EN", "EN→HI"][i]}</span>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
};

export default Dashboard;