import React, { useState } from 'react';
import './NavBar.css' ;
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";

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
            <Link to="/login" className="button border">Log in</Link>
            <Link to="/signUp" className="button purple">Sign up</Link>
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