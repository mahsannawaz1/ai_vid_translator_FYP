import React, { useState } from 'react';
import './Tutorial.css';

const videos = [
    {
        src: '/videos/video1.mp4',
        title: 'Video Tutorial',
        description: 'Quick and Easy to Use',
    },
    {
        src: '/videos/video2.mp4',
        title: 'Video Tutorial',
        description: 'Quick and Easy to Use',
    },
];

function Tutorial({ tutorialRef }) {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % videos.length);
    const prev = () => setIndex((prev) => (prev - 1 + videos.length) % videos.length);

    return (
        <div class="container" ref={tutorialRef}>
            <div className="carousel-container">
            <div className="carousel-left">
                <h2>{videos[index].title}</h2>
                <p>{videos[index].description}</p>
                <div className="carousel-buttons">
                <button onClick={prev}>❮</button>
                <button onClick={next}>❯</button>
                </div>
            </div>
            <div className="carousel-right">
                <div className="video-wrapper">
                <video key={videos[index].src} controls autoPlay muted>
                    <source src={videos[index].src} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                </div>
            </div>
            </div>
        </div>
    );
}
export default Tutorial;