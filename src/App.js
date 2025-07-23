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
        </Routes>
      </div>
    </Router>
  );
}

export default AppRoutes;
