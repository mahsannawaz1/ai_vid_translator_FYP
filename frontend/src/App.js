import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import './App.css';
import AuthPage from './components/AuthPage/AuthPage';
import SignUpPage from './components/SignUpPage/signUp';
import LoadPage from './components/UploadingPage/LoadPage';
import VideoPage from './components/VideoPage/VideoPage';
import DownloadPage from './components/DownloadPage/DownloadPage';
import ProcessingPage from './components/ProcessingPage/Processing';
import HomePage from './components/HomePage/HomePage'; 
import VerifyEmail from './components/SignUpPage/VerifyEmail';
import VerifiedEmail from './components/SignUpPage/VerifiedEmail';
import Dashboard from './components/DashBoardPage/Dashboard';
import { getToken } from './services/userService';


function App() {
  const [authToken, setAuthToken] = useState(getToken());

  useEffect(() => {
    const handleStorageChange = (e) => {
      setAuthToken(getToken());
    };

    setAuthToken(getToken());

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  console.log(authToken)
  const loggedInRoutes = [
    <Route path="/translate" element={<LoadPage setAuthToken={setAuthToken} />} key={"translate"} />,
    <Route path="/video" element={<VideoPage />} key={"video"} />,
    <Route path="/download" element={<DownloadPage setAuthToken={setAuthToken} />} key={"download"} />,
    <Route path="/processing" element={<ProcessingPage />} key={"processing"} />,
    <Route path="/dashboard" element={<Dashboard setAuthToken={setAuthToken} />} key={"dashboard"} />,
    <Route path="/login" element={authToken ? <Navigate to="/" replace /> : <AuthPage />} key={"login"} />,
    <Route path="/signUp" element={authToken ? <Navigate to="/" replace /> : <SignUpPage />} key={"signUp"} />,
  ]
  const loggedOutRoutes = [
    <Route path="/verify" element={<VerifyEmail />} key={"verify"}/>,
    <Route path="/verified" element={<VerifiedEmail />} key={"verified"}/>,
    <Route path="/login" element={<AuthPage setAuthToken={setAuthToken} />} key={"login"} />,
    <Route path="/signUp" element={<SignUpPage />} key={"signUp"} />,
  ]
  return (
    <div className="App">
      <Router>
        {/* Route setup using Routes instead of Switch */}
        <Routes>
          {/* Default Route for AuthPage */}
          {authToken ? 
          loggedInRoutes?.map(token=>token)
          :
          loggedOutRoutes?.map(token=>token)
          }
          <Route path="/" element={<HomePage setAuthToken={setAuthToken} />} />,
          {!authToken && <Route path="*" element={<Navigate to="/login" replace />} />}
        </Routes>
      </Router>
    </div>
  );
}




export default App;


