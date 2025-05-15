import React, { useState } from 'react';
import './NavBar.css' ;
import logo from '../../assets/logo.png';

export default function Navbar({ onFaqClick, onProductsClick, onTutorialClick }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <div className='position-relative'>
        <div className="navbar w-100">
            <div className="logo">
            <img src={logo} alt="Logo" />
            <span>Pixel AI</span>
            
            </div>
            <button className="hamburger" onClick={toggleMobileMenu}>
            ☰
            </button>
            <div className="menu">
            <a onClick={onProductsClick}>Products</a>
            <a onClick={onTutorialClick}>Tutorial</a>
            {/* <a href="#">About us</a> */}
            <a onClick={onFaqClick}>FAQs</a>
            <a href="#" className="button border">Log in</a>
            <a href="#" className="button purple">Sign up</a>
            </div>
        </div>

        <div id="mobileMenu" className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
            <a href="#">Log in</a>
            <a href="#">Result Library</a>
            <a href="#">Dashboard</a>
            <a href="#">Products</a>
            <a href="#">Resources</a>
            <a href="#">Company</a>
            <a href="#">Enterprise</a>
            <a href="#">API</a>
        </div>
        </div>
    );
}