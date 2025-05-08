import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import AuthPage from './components/AuthPage/AuthPage';
import LoadPage from './components/UploadingPage/LoadPage';
import VideoPage from './components/VideoPage/VideoPage';
import DownloadPage from './components/DownloadPage/DownloadPage';

function App() {
  return (
    <div className="App">
      <Router>
        {/* Route setup using Routes instead of Switch */}
        <Routes>
          {/* Default Route for AuthPage */}
          <Route path="/" element={<AuthPage />} />
          
          {/* Other Routes */}
          <Route path="/upload" element={<LoadPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/download" element={<DownloadPage />} />
        </Routes>
      </Router>
    </div>
  );
}




export default App;


