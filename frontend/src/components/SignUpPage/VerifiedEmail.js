import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../HomePage/NavBar';
import logo from '../../assets/logo.png';
import successImg from '../../assets/success.svg';
import { verifyUserEmail } from '../../services/userService';

const VerifiedEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState("");

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
        navigate("/", { replace: true });
        } else {
        setToken(tokenFromUrl);
        }
    }, [searchParams, navigate]);

    useEffect(() => {
        if (token.length > 0) {
        verifyUserEmail(token);
        }
    }, [token]);
    return (
        <>
            <Navbar />
            <div className='container verify-email-div'>
                <img src={logo} alt="Pixel AI Logo" className="signup-logo" />
                <p>Welcome to Pixel AI.</p>

            <div className='d-flex flex-column justify-content-center justify-content-center'>
                <h4 className='text-center'>Email Verification Done</h4>
                <div >
                    <p className='text-center'>You're done.</p>
                    <p>You can now <a style={{color:'rgb(168, 168, 168) !important'}} href="/login">Sign In</a> to translate videos.</p>
                </div>
                <img src={successImg} alt="Success Image" className="verify-img w-100" />
            </div>
            </div>
        </>
    )
}

export default VerifiedEmail