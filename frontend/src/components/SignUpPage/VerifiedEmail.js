import Navbar from '../HomePage/NavBar'
import logo from '../../assets/logo.png'
import successImg from '../../assets/success.svg'
const VerifiedEmail = () => {
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