import React, { useState } from 'react';
import './NavBar.css' ;
import logo from '../../assets/logo.png';
import { Link, useNavigate } from "react-router-dom";
import { getToken, logOutUser } from '../../services/userService';

export default function Navbar({ onFaqClick, onProductsClick, onTutorialClick, setAuthToken }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const token = getToken()
    const navigate = useNavigate()
    const toggleMobileMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLogoutUser = () => {
        logOutUser()
        setAuthToken(null)
        navigate("/login")
    }

    return (
        <div className='position-relative'>
        <div className="navbar w-100">
            <Link to="/" className='logo-link'>
                <div className="logo">
                    <img src={logo} alt="Logo" />
                    <span>Pixel AI</span>  
                </div>
            </Link>

            <button className="hamburger" onClick={toggleMobileMenu}>
            ☰
            </button>
            <div className="menu">
            <a onClick={onProductsClick}>Products</a>
            <a onClick={onTutorialClick}>Tutorial</a>
            {/* <a href="#">About us</a> */}
            <a onClick={onFaqClick}>FAQs</a>
            {!token ?
            <>
                <Link to="/login" className="button border">Log in</Link>
                <Link to="/signUp" className="button purple">Sign up</Link>
            </>
            :
            <>
                <Link to="/dashboard" className="button border">Dashboard</Link>
                <button className="button purple border-0" onClick={handleLogoutUser}>Logout</button>
            </>
            
            }

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