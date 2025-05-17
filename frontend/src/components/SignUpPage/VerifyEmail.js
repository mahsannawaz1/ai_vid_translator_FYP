import Navbar from '../HomePage/NavBar'
import logo from '../../assets/logo.png'
import waitingImg from '../../assets/waiting.svg'

const VerifyEmail = () => {
    return (
        <>
            <Navbar />
            <div className='container verify-email-div'>
                <img src={logo} alt="Pixel AI Logo" className="signup-logo" />
                <p>Welcome to Pixel AI.</p>
                <div >
                    <h4 className='text-center'>Verify Your Email</h4>
                    <div className='d-flex flex-column justify-content-center justify-content-center'>
                        <p className='text-center'>You're one step away.</p>
                        <p className='text-center'>We've sent a verification email to nawazehsen@gmail.com</p>
                        <p className='text-center'>Clicking on the email confirmation link, lets us know that your email is both valid and yours.</p>
                    </div>
                    <img src={waitingImg} alt="Success Image" className="verify-img w-100" />
                </div>
            </div>
        </>

    )
}

export default VerifyEmail