import React, { useState } from 'react';
import LogoutModalPage from './Logout.jsx';

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="relative w-full max-w-[700px] h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden">
        

        {/* 슬라이딩 영역 */}
        <div
          className={`absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-1000 ease-in-out ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}
        >
          {/* 로그인 폼 */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">LOGIN</h2>
            <input
              type="email"
              placeholder="아이디 또는 이메일 주소"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <button className="w-fit self-end bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition">
              Log in
            </button>
            <LogoutModalPage />
          </div>

          {/* 회원가입 폼 */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">SIGN UP</h2>
            <input
              type="text"
              placeholder="아이디 또는 이메일 주소"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-green-500 py-2 mb-6"
            />
            <button className="w-fit self-end bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition">
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

export default Signup;
