import React, { useState, useRef, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyPageButtonWithPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // 팝업 밖 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed bottom-8 right-3 z-50 flex flex-col items-end"
    >
      {/* 버튼 */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center bg-green-400 text-white px-3 py-2 rounded-full shadow-lg transition"
      >
        {isOpen ? <X className="w-8 h-8 md:w-12 md:h-12" /> : <Heart className="w-8 h-8 md:w-12 md:h-12" />}
      </button>

      {/* 팝업 */}
      <div
        className={`absolute bottom-full mb-1 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col transform transition-all duration-300 
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <button
          className="px-3 py-2 w-40 text-center hover:bg-gray-100 border-b border-gray-200 w-full text-left"
          onClick={() => {
            setIsOpen(false);
            navigate('/Roadmap');
          }}
        >
          로드맵 페이지 이동
        </button>
        <button
          className="px-3 py-2 w-40 text-center hover:bg-gray-100"
          onClick={() => {
            setIsOpen(false);
            navigate('/mypage');
          }}
        >
          마이페이지 이동
        </button>
      </div>
    </div>
  );
};

export default MyPageButtonWithPopup;
