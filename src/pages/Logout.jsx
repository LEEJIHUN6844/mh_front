import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutModalPage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 로그아웃 요청 예시 (백엔드에 POST 요청)
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include', // 세션 기반이면 이거 포함
      });

      // 토큰 기반이라면 localStorage 제거
      localStorage.removeItem('token');

      // 로그인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="fixed top-[64.7%] left-[6.1%] sm:left-[3.4%] w-fit self-end bg-green-500 hover:bg-green-600 text-white px-4 py-2 z-40 rounded-full transition"
      >
        Log out
      </button>

      {showModal && (
        <div className="fixed inset-0 w-1/2 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="mb-4 text-lg font-semibold">정말 로그아웃하시겠습니까?😭</p>
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                예
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogoutModalPage;
