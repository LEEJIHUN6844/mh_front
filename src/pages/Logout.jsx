import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutModalPage({ setShowModal, setIsLoggedIn, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        localStorage.removeItem("token");   // 토큰 제거
        setIsLoggedIn(false);               // 로그인 상태 false로 변경
        setShowModal(false);                // 모달 닫기
        onLogout?.(); 
        alert("로그아웃 성공");
        navigate("/");                      // 메인으로 이동
      } else {
        console.error("로그아웃 실패:", res.status);
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
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
  );
}

export default LogoutModalPage;
