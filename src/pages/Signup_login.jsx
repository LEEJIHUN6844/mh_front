import React, { useState, useEffect } from 'react';
import LogoutModalPage from './Logout.jsx';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ UserID: '', UserPW: '' });
  const [signupData, setSignupData] = useState({ UserName: '', UserID: '', UserPW: '' });
  const Navigate = useNavigate();
  const [userName, setUserName] = useState('');


  // 서버 연결 테스트
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
      })
      .catch(() => console.log('서버 연결 실패'));
  }, []);

  // 로그인 처리
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserID: loginData.UserID,
          UserPW: loginData.UserPW
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Login failed:', errData);
        return;
      }

      const data = await response.json();
      console.log('Login Success:', data);
      setUserName(data.UserName);
      Navigate('/');
    } catch (error) {
      console.error('Login Error:', error.message);
    }
  };

  // 회원가입 처리
  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserName: signupData.UserName,
          UserID: signupData.UserID,
          UserPW: signupData.UserPW
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Signup failed:', errData);
        return;
      }

      const data = await response.json();
      console.log('Signup Success:', data);
    } catch (error) {
      console.error('Signup Error:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-[700px] h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
        
        {/* 폼 영역 */}
        <div
          className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-1000 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}
        >
          {/* 로그인 */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">LOGIN</h2>
            <input
              type="text"
              placeholder="아이디 또는 이메일 주소"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, UserID: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, UserPW: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <button
              onClick={handleLogin}
              className="w-fit self-end bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
            >
              Log in
            </button>
            <LogoutModalPage />
          </div>

          {/* 회원가입 */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">SIGN UP</h2>
            <input
              type="text"
              placeholder="이름"
              value={signupData.UserName}
              onChange={(e) => setSignupData({ ...signupData, UserName: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="아이디 또는 이메일 주소"
              value={signupData.UserID}
              onChange={(e) => setSignupData({ ...signupData, UserID: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={signupData.UserPW}
              onChange={(e) => setSignupData({ ...signupData, UserPW: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <button
              onClick={handleSignup}
              className="w-fit self-end bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
            >
              Sign up
            </button>
          </div>
        </div>

        {/* 토글 버튼 */}
        <div className="absolute top-5 right-5">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:underline"
          >
            {isLogin ? 'Go to Sign up' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupLogin;
