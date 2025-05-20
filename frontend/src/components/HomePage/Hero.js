import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className='hero d-flex flex-column justify-content-center align-items-center'>
            <h1 className='hero-heading'>Convert Your Favourite Videos with  <span className='hero-heading-content'>PIXEL AI</span> </h1>
            <h2 className='hero-sub-heading'>Powerful and Simple to Use</h2>
            <div className='d-flex align-items-center justify-content-center'>
                <Link to="/translate" className="translate-btn">Translate Now</Link>
            </div>
        </div>
    )
}

export default Hero