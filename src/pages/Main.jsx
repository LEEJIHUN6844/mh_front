import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { Heart } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';

{/* 오른쪽 상단 햄버거 메뉴 */}
const HamburgerMenu = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 text-white p-2"
      >
        {isOpen ? <X size={28} /> : <Menu size={30} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-[60%] sm:w-60 bg-white shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="p-6 space-y-4">
          <li><Link to="/" onClick={() => setIsOpen(false)}>홈</Link></li>
          <li><Link to="/Eating" onClick={() => setIsOpen(false)}>혼밥</Link></li>
          <li><Link to="/Playing" onClick={() => setIsOpen(false)}>혼놀</Link></li>
          <li><Link to="/Sleeping" onClick={() => setIsOpen(false)}>혼숙</Link></li>
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

{/* 카드 슬라이드 제목 및 값 */}
const categories = [
  { title: '추천', cities: ['목포', '속초', '대구', '고양', '광주'] },
  { title: '혼밥', cities: ['목포', '속초', '대구', '고양', '광주'] },
  { title: '혼놀', cities: ['목포', '속초', '대구', '고양', '광주'] },
  { title: '혼숙', cities: ['목포', '속초', '대구', '고양', '광주'] },
];

{/* 카드 슬라이드 영역 및 CSS */}
const SwiperSection = () => {
  return (
    <div
      className="bg-white w-full rounded-t-3xl shadow-xl z-30 p-6 space-y-5 mt-[65vh] opacity-0 animate-slide-up"
      style={{ position: 'relative' }} 
    >
      {categories.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <Swiper
            slidesPerView={3}
            spaceBetween={12}
            pagination={{ clickable: true }}
            mousewheel={true}
            modules={[Pagination, Mousewheel]}
            className="w-full"
          >
            {section.cities.map((city, index) => (
              <SwiperSlide key={index}>
                <div
                  className="w-full h-[200px] rounded-xl bg-cover bg-center shadow-md flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    backgroundImage: `url(/assets/${city}.jpg)`,
                  }}
                >
                  {city}
                </div>
              </SwiperSlide>
            ))}
            <SwiperSlide>
              <div className="w-full h-[200px] rounded-xl bg-lime-600 flex items-center justify-center text-white font-bold shadow-md">
                더보기
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      ))}
    </div>
  );
};

{/* 로딩 함수 선언 */}
const Main = () => {
  const [isLoading, setIsLoading] = useState(false); // 로딩중 여부 확인
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 여부 확인
  const [isOpen, setIsOpen] = useState(false); // (예: 검색창 등 UI 열림 상태)
  const navigate = useNavigate(); // 페이지 이동
  
  // 로딩 상태가 true로 설정되면 0.8초 후에 로딩 해제
   useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // 0.8초 후 로딩 해제
    return () => clearTimeout(timer);
  }, []);

  {/* 로딩 함수 */}
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-green-500 mb-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-gray-600 text-lg font-medium">로딩중입니다...</p>
        </div>
      </div>
    );
  }

  {/* 로딩 함수 사용 */}
  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/Signup');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* 🖼️ 배경 이미지 */}
      <img
        src="/assets/바다.jpg"
        alt="제주도 배경"
        className="absolute top-0 left-0 w-full sm: w-[100%] sm: h-[50%] h-[600px] object-cover object-bottom z-10"
      />
      {/* 마이페이지 바로 가기 버튼 */}
      <MyPageButtonWithPopup />


      {/* 왼쪽 상단 로그인 일러스트 및 바로가기 */}
      <button
        onClick={handleLoginClick}
        className="absolute top-5 left-5 bg-glass text-black px-3 py-1 rounded-md shadow-md z-50 flex items-center"
      >
        <User size={20} className="text-white" />
        <span className="font-bold">{isLoggedIn ? '' : ''}</span>
      </button>

      {/* 햄버거 메뉴 함수 */}
      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />

     {/* 타이틀 문구 */}
<div className="absolute top-[5%] left-5 z-40 text-white font-bold text-6xl sm:text-7xl space-y-2 drop-shadow-md opacity-0 animate-slide-up">
  <p>모험의 순간</p>
  <p>자연과 함께</p>
</div>

{/* 🔍 검색창 */}
<div
  className={`
    absolute top-[29%] left-[7.5%] transform -translate-x-1/2 w-[85%]
    sm:top-[29%] sm:w-[1200px] md:left-[8.8%]
    2xl:top-[39.5%] 2xl:w-[85%] 2xl:left-[7.5%]
    transition-opacity duration-300
    ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 z-40 animate-slide-up'}
  `}
>
  <form className="flex items-center bg-white rounded-3xl shadow-md px-4 py-2 border border-gray-200">
    <input
      type="search"
      placeholder="검색어를 입력해보세요!!"
      className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg pl-2"
    />
    <button type="submit" className="text-lime-500">
      <Search size={24} strokeWidth={3} />
    </button>
  </form>
</div>


{/* 🌀 SwiperSection 렌더링 */}
<SwiperSection />

{/* 🏷️ 하단 문구 */}
<div className="mt-10 p-4 bg-glass opacity-20 w-full pl-6">
  <div className="w-full h-px bg-black mb-2" /> 
  <p className="text-black font-semibold text-lg text-left">
    멋쟁이사자처럼 13기 해커톤 프로젝트 <br />
    😎우리조잘했조 - 이지훈 김정현 송원영<br />
    프로젝트 기간: 2025.00.00 ~ 2025.08.26
  </p>
  </div>
</div>
  );
};

export default Main;
