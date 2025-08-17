import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sleeping from './pages/Sleeping.jsx';
import Signup from './pages/Signup_login.jsx';
import Playing from './pages/Playing.jsx';
import Mypage from './pages/Mypage.jsx';
import Main from './pages/Main.jsx';
import Eating from './pages/Eating.jsx';
import Logout from './pages/Logout.jsx';
import Loding from './pages/Loading.jsx';
import Roadmap from './pages/Roadmap.jsx';
import EatingReview from './pages/EatingReview';
import PlayingReview from './pages/PlayingReview.jsx';
import SleepingReview from './pages/SleepingReview.jsx';


function AppRoutes() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/sleeping" element={<Sleeping />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/playing" element={<Playing />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/eating" element={<Eating />} />
          <Route path="/login" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/loading" element={<Loding />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/eating/:storeId" element={<EatingReview />} />
          <Route path="/playing/:storeId" element={<PlayingReview />} />
          <Route path="/sleeping/:storeId" element={<SleepingReview />} />
          <Route path="/store/eating/:storeId" element={<EatingReview />} />
          <Route path="/store/playing/:storeId" element={<PlayingReview />} />
          <Route path="/store/sleeping/:storeId" element={<SleepingReview />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AppRoutes;
