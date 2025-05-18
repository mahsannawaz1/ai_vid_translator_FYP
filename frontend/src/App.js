import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import SignUpPage from './components/SignUpPage/signUp';
import AuthPage from './components/AuthPage/AuthPage';
import LoadPage from './components/UploadingPage/LoadPage';
import VideoPage from './components/VideoPage/VideoPage';
import DownloadPage from './components/DownloadPage/DownloadPage';
import HomePage from './components/HomePage/HomePage';
import ProcessingPage from './components/ProcessingPage/Processing';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Route setup using Routes instead of Switch */}
        <Routes>
          {/* Default Route for AuthPage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Other Routes */}
          <Route path='/signUp' element={<SignUpPage/>}/>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/upload" element={<LoadPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path='/processing' element={<ProcessingPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}




export default App;


