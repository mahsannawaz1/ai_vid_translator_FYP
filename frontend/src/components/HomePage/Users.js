import React, { useState } from 'react';
import './Users.css';
import businessImg from '../../assets/business.jpg';
import creatorsImg from '../../assets/vid_creator.jpg';
import teachersImg from '../../assets/teachers.jpg';
import learnersImg from '../../assets/language_learners.jpg';
import podcasters from '../../assets/podcasters.jpg';
import customerTeam from '../../assets/customer_team.jpg';

const cardItems = [
    {
        img: businessImg,
        title: 'Marketing and Sales Professionals',
        desc: 'Marketing and Sales Professionals can localize campaign videos, product promos, and branding content to boost visibility and drive more conversions.'
    },
    {
        img: creatorsImg,
        title: 'Content Creators and Influencers',
        desc: 'Content Creators and Influencers can expand their global reach by producing multilingual videos that engage wider audiences.'
    },
    {
        img: teachersImg,
        title: 'Educators and Instructors',
        desc: 'Educators and Instructors can enhance learning by delivering content in multiple languages for students of all backgrounds.'
    },
    {
        img: learnersImg,
        title: 'Students and Language Enthusiasts',
        desc: 'Students and Language Enthusiasts can watch videos in different languages to improve comprehension and fluency.'
    },
    {
        img: podcasters,
        title: 'Podcast Hosts and Trainers',
        desc: 'Podcast Hosts and Trainers can share their message globally by translating voice and video episodes into different languages.'
    },
    {
        img: customerTeam,
        title: 'Global Customer Service Teams',
        desc: 'Global Customer Service Teams can create multilingual support videos to better assist customers across regions.'
    }
];

function Users() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % cardItems.length);
    const prev = () => setIndex((prev) => (prev - 1 + cardItems.length) % cardItems.length);

    return (
        <div class="container">
            <div className="multi-carousel-wrapper">
            <h2 className="multi-carousel-title">Pixel AI Video Translator for a Wide Range of Users and Use Cases</h2>
            <p className="multi-carousel-subtitle">
                Our AI Video Translator enables professionals from diverse industries to easily create high-quality video translations, unlock strategic benefits, and accomplish a variety of objectives.
            </p>
            <div className="multi-carousel">
                <button className="multi-carousel-btn left" onClick={prev}>❮</button>
                <div className="multi-carousel-track">
                {cardItems.slice(index, index + 3).map((item, idx) => (
                    <div className="multi-carousel-card" key={idx}>
                    <img src={item.img} alt={item.title} />
                    <div className='card-item'>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                    </div>
                    </div>
                ))}
                </div>
                <button className="multi-carousel-btn right" onClick={next}>❯</button>
            </div>
            </div>
        </div>
    );
}
export default Users;
