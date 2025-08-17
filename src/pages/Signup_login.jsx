import React, { useState, useEffect } from 'react';
import LogoutModalPage from './Logout.jsx';
import { useNavigate } from 'react-router-dom';

const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ UserID: '', UserPW: '' });
  const [signupData, setSignupData] = useState({ UserName: '', UserID: '', UserPW: '' });
  const navigate = useNavigate();

  // 서버 연결 테스트
  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(data => console.log(data.message))
      .catch(() => console.log('서버 연결 실패'));
  }, []);

  // 로그인 요청
  const handleLogin = async () => {
    const response = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 쿠키 포함
      body: JSON.stringify({
        UserID: loginData.UserID,
        UserPW: loginData.UserPW
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      navigate("/");
    } else {
      alert(data.detail);
    }
  };

  // 회원가입 요청
  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error('Signup failed:', errData);
        return;
      }

      const data = await response.json();
      alert('회원가입 성공! 로그인 화면으로 이동합니다.');
      console.log('Signup Success:', data);
      setIsLogin(true); // 회원가입 후 로그인 화면으로 전환
    } catch (error) {
      console.error('Signup Error:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-[700px] h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">

        {/* 로그인/회원가입 슬라이드 */}
        <div className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-1000 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}>

          {/* 로그인 */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">LOGIN</h2>
            <input
              type="text"
              placeholder="아이디 또는 이메일 주소"
              value={loginData.UserID}
              onChange={(e) => setLoginData({ ...loginData, UserID: e.target.value })}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={loginData.UserPW}
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
