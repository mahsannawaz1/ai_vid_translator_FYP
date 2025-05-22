import React, { useState } from 'react';
import './Tutorial.css';
import tutorialVid from '../../assets/tutorial_vid.mp4'


function Tutorial({ tutorialRef }) {
    return (
        <div class="container" ref={tutorialRef}>
            <div className="carousel-container">
            <div className="carousel-left">
                <h2>Video Tutorial</h2>
                <p>Quick and easy to use</p>
            </div>
            <div className="carousel-right">
                <div className="video-wrapper">
                <video key={tutorialVid} controls autoPlay muted>
                    <source src={tutorialVid} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                </div>
            </div>
            </div>
        </div>
    );
}
export default Tutorial;