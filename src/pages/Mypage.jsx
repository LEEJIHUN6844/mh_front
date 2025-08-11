import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Utensils, } from 'lucide-react';
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
const EatingData = [
  {
    id: 1,
    name: '후지마제소바',
    location: '서울 강남구',
    image: '/assets/soba.jpg',
  },
  {
    id: 2,
    name: '백반의신',
    location: '서울 신촌',
    image: '/assets/baekban.jpg',
  },
  {
    id: 3,
    name: '속초 해물탕',
    location: '강원도 속초',
    image: '/assets/seafood.jpg',
  },
  {
    id: 4,
    name: '춘천 닭갈비',
    location: '강원도 춘천',
    image: '/assets/닭갈비.jpg',
  },
  {
    id: 5,
    name: '돈까스 명가',
    location: '경기도 수원',
    image: '/assets/돈까스.jpg',
  },
];

const PlayingData = [
  {
    id: 1,
    name: '방탈출 카페 브레인',
    location: '서울 홍대',
    rating: 4.8,
    soloScore: 93,
    tags: ['1인 가능 테마', '두뇌 회전', '몰입감 최고'],
    image: '/assets/방탈출.jpg',
  },
  {
    id: 2,
    name: '혼자 보는 독립영화관',
    location: '서울 종로',
    rating: 4.6,
    soloScore: 91,
    tags: ['조용한 관람', '1인 좌석', '예술영화 상영'],
    image: '/assets/영화관.jpg',
  },
  {
    id: 3,
    name: '1인 노래연습장',
    location: '서울 신내',
    rating: 4.7,
    soloScore: 96,
    tags: ['스트레스 해소', '방음 완벽', '1인 부스'],
    image: '/assets/노래방.jpg',
  },
  {
    id: 4,
    name: '혼자 타는 전동킥보드 투어',
    location: '강원 삼척',
    rating: 4.5,
    soloScore: 90,
    tags: ['경치 감상', '야외 활동', '자유로운 여행'],
    image: '/assets/킥보드.jpg',
  },
  {
    id: 5,
    name: '힐링 드로잉 클래스',
    location: '경기 분당',
    rating: 4.9,
    soloScore: 94,
    tags: ['조용한 취미', '개인 집중', '비대면도 가능'],
    image: '/assets/드로잉.jpg',
  },
];

const SleepingData = [
  {
    id: 1,
    name: '서울 1인 감성호텔',
    location: '서울 강남구',
    image: '/assets/감성호텔.jpg',
  },
  {
    id: 2,
    name: '신촌 셀프 체크인 모텔',
    location: '서울 신촌',
    image: '/assets/셀프체크인호텔.jpg',
  },
  {
    id: 3,
    name: '속초 바다뷰 게스트하우스',
    location: '강원 속초',
    image: '/assets/바다뷰게스트하우스.jpg',
  },
  {
    id: 4,
    name: '춘천 조용한 펜션',
    location: '강원 춘천',
    image: '/assets/펜션.jpg',
  },
  {
    id: 5,
    name: '수원 미니 원룸텔',
    location: '경기 수원',
    image: '/assets/원룸텔.jpg',
  },
];

const LoadmapData = [
  {
    id: 1,
    name: '후지마제소바',
    location: '서울 강남구',
    image: '/assets/soba.jpg',
  },
  {
    id: 2,
    name: '백반의신',
    location: '서울 신촌',
    image: '/assets/baekban.jpg',

  },
  {
    id: 3,
    name: '혼자 타는 전동킥보드 투어',
    location: '강원 삼척',
    image: '/assets/킥보드.jpg',
  },
  {
    id: 4,
    name: '춘천 조용한 펜션',
    location: '강원 춘천',
    image: '/assets/펜션.jpg',
  },
  {
    id: 5,
    name: '수원 미니 원룸텔',
    location: '경기 수원',
    image: '/assets/원룸텔.jpg',
  },

];


{/* 카드 슬라이드 영역 및 CSS */}
const categories = [
  { title: '🍱혼밥 찜 목록', data: EatingData },
  { title: '🎮혼놀 찜 목록', data: PlayingData },
  { title: '🏠혼숙 찜 목록', data: SleepingData },
  { title: '📍나의 로드맵', data: LoadmapData },
];

const SwiperSection = () => {
  return (
    <div
      className="bg-white w-full rounded-t-3xl shadow-xl z-30 p-6 space-y-10 mt-[55vh] opacity-0 animate-slide-up"
      style={{ position: 'relative' }}
    >
      {categories.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          <Swiper
            slidesPerView={3}
            spaceBetween={12}
            pagination={{ clickable: true }}
            mousewheel={true}
            modules={[Pagination, Mousewheel]}
            className="w-full object-cover"
          >
            {section.data.map((item, index) => {
              // 객체 배열 형태 - name 프로퍼티 존재 시
              if (typeof item === 'object' && item.name) {
                return (
                  <SwiperSlide key={index}>
                    <div
                      className="w-full h-[200px] rounded-xl bg-cover bg-center shadow-md flex flex-col justify-end p-4 text-white font-bold text-xl"
                      style={{
                        backgroundImage: `url(${item.image})`,
                      }}
                    >
                      <p>{item.name}</p>
                      <p className="text-sm">{item.location}</p>
                    </div>
                  </SwiperSlide>
                );
              } else {
                // 문자열 배열인 경우 (도시명 등)
                return (
                  <SwiperSlide key={index}>
                    <div
                      className="w-full h-[200px] rounded-xl bg-cover bg-center shadow-md flex items-center justify-center text-white font-bold text-xl"
                      style={{
                        backgroundImage: `url(/assets/${item}.jpg)`,
                      }}
                    >
                      {item}
                    </div>
                  </SwiperSlide>
                );
              }
            })}
            <SwiperSlide>
              <div className="w-full h-[200px] rounded-xl bg-white flex items-center justify-center text-black font-bold shadow-md">
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
        src="/assets/마이페이지.jpg"
        alt="마이페이지 배경"
        className="absolute top-0 left-0 w-full sm: w-full sm: h-[40%] object-cover z-10"
      />
      {/* 마이페이지 바로 가기 버튼 */}
      <MyPageButtonWithPopup />

      {/* 왼쪽 상단 로그인 일러스트 및 바로가기 */}
      <button
        onClick={handleLoginClick}
        className="absolute top-5 left-5 bg-glass px-3 py-1 rounded-md shadow-md z-50 flex items-center"
      >
        <User size={20} className="text-white" />
        <span className="font-bold">{isLoggedIn ? '' : ''}</span>
      </button>

      {/* 햄버거 메뉴 함수 */}
      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />

     {/* 타이틀 문구 */}
<div className="absolute top-[5%] left-5 z-40 text-white font-bold text-5xl sm:text-7xl space-y-2 drop-shadow-md opacity-0 animate-slide-up">
  <p>마이페이지</p>
  <p></p>
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
