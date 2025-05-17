import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './components/AuthPage/AuthPage';
import SignUpPage from './components/SignUpPage/signUp';
import LoadPage from './components/UploadingPage/LoadPage';
import VideoPage from './components/VideoPage/VideoPage';
import DownloadPage from './components/DownloadPage/DownloadPage';
import HomePage from './components/HomePage/HomePage'; 
import VerifyEmail from './components/SignUpPage/VerifyEmail';
import VerifiedEmail from './components/SignUpPage/VerifiedEmail';


function App() {
  return (
    <div className="App">
      <Router>
        {/* Route setup using Routes instead of Switch */}
        <Routes>
          {/* Default Route for AuthPage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Other Routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/verified" element={<VerifiedEmail />} />
          <Route path="/upload" element={<LoadPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </Router>
    </div>
  );
}




export default App;


