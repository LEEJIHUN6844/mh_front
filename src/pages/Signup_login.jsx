import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LogoutModalPage from './Logout.jsx';

// 햄버거 메뉴 컴포넌트
const HamburgerMenu = ({ isOpen, setIsOpen, isLoggedIn, handleLoginClick, handleLogoutClick }) => (
  <>
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="absolute top-4 right-4 z-50 text-gray-700 p-2"
    >
      {isOpen ? <X size={28} /> : <Menu size={30} />}
    </button>

    <div className={`fixed top-0 right-0 h-full w-[60%] sm:w-60 bg-white shadow-lg z-50 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <ul className="p-6 space-y-4">
        <li className="flex justify-between items-center border-b border-gray-300 pb-2">
          <span>홈</span>
          {isLoggedIn ? (
            <button
              onClick={handleLogoutClick}
              className="bg-red-500 text-white px-2 py-1 rounded-md text-sm shadow"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-green-500 text-white px-2 py-1 rounded-md text-sm shadow"
            >
              로그인
            </button>
          )}
        </li>
        <li><span>혼밥</span></li>
        <li><span>혼놀</span></li>
        <li><span>혼숙</span></li>
      </ul>
    </div>

    {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)} />}
  </>
);

// 회원가입/로그인 페이지
const SignupLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // 햄버거 메뉴
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loginData, setLoginData] = useState({ UserID: '', UserPW: '' });
  const [signupData, setSignupData] = useState({ UserName: '', UserID: '', UserPW: '' });
  const navigate = useNavigate();

  // 쿠키 체크로 로그인 상태 확인
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:8000/mypage', { credentials: 'include' });
        setIsLoggedIn(res.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  // 로그인 요청
  const handleLogin = async () => {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      setIsLoggedIn(true);
      navigate("/");
    } else {
      alert(data.detail);
    }
  };

  // 회원가입 요청
  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      if (!response.ok) {
        const errData = await response.json();
        console.error('Signup failed:', errData);
        return;
      }
      alert('회원가입 성공! 로그인 화면으로 이동합니다.');
      setIsLogin(true);
    } catch (error) {
      console.error('Signup Error:', error.message);
    }
  };

  // 햄버거 메뉴 로그인 클릭
  const handleHamburgerLogin = () => {
    setIsLogin(true);
    setIsOpen(false);
  };

  // 햄버거 메뉴 로그아웃 클릭
  const handleHamburgerLogout = () => {
    setShowLogoutModal(true);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* 햄버거 메뉴 */}
      <HamburgerMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoggedIn={isLoggedIn}
        handleLoginClick={handleHamburgerLogin}
        handleLogoutClick={handleHamburgerLogout}
      />

      {/* 로그아웃 모달 - 화면 최상단에서 전체 렌더링 */}
      {showLogoutModal && <LogoutModalPage setShowModal={setShowLogoutModal} />}

      {/* 로그인/회원가입 UI */}
      <div className="relative w-full max-w-[700px] h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
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
