import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, Heart } from 'lucide-react';
import FilterDropdown from '../pages/FilterDropdown';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';

// 샘플 데이터
const sampleData = [
  {
    id: 1,
    name: '서울 1인 감성호텔',
    location: '서울 강남구',
    rating: 4.8,
    soloScore: 96,
    tags: ['1인 전용 객실', '조용한 분위기', '감성 인테리어'],
    image: '/assets/감성호텔.jpg',
  },
  {
    id: 2,
    name: '신촌 셀프 체크인 모텔',
    location: '서울 신촌',
    rating: 4.4,
    soloScore: 90,
    tags: ['셀프 체크인', '프라이버시 보장', '혼자 여행객 인기'],
    image: '/assets/셀프체크인호텔.jpg',
  },
  {
    id: 3,
    name: '속초 바다뷰 게스트하우스',
    location: '강원 속초',
    rating: 4.7,
    soloScore: 93,
    tags: ['오션뷰', '1인실 선택 가능', '조용한 휴식'],
    image: '/assets/바다뷰게스트하우스.jpg',
  },
  {
    id: 4,
    name: '춘천 조용한 펜션',
    location: '강원 춘천',
    rating: 4.6,
    soloScore: 92,
    tags: ['혼자 힐링', '자연 속 숙소', '취사가능'],
    image: '/assets/펜션.jpg',
  },
  {
    id: 5,
    name: '수원 미니 원룸텔',
    location: '경기 수원',
    rating: 4.3,
    soloScore: 88,
    tags: ['가성비 숙소', '1인 전용', '장기 투숙 가능'],
    image: '/assets/원룸텔.jpg',
  },
];


// 햄버거 메뉴
const HamburgerMenu = ({ isOpen, setIsOpen }) => (
  <>
    <button onClick={() => setIsOpen(!isOpen)} className="absolute top-4 right-4 z-50 text-white p-2">
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
    {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)} />}
  </>
);

// ✅ Main 컴포넌트
const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-green-500 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-gray-600 text-lg font-medium">로딩중입니다...</p>
        </div>
      </div>
    );
  }

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/Signup');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50">
      {/* 🖼️ 배경 이미지 */}
      <img
        src="/assets/혼숙.jpg"
        alt="혼숙 배경"
        className="absolute top-0 left-0 w-full h-[25%] sm:w-full sm:h-[50%] object-cover object-bottom"
      />

      {/* 마이페이지 버튼 */}
      <MyPageButtonWithPopup />
      {/* 로그인/회원가입 */}
      <button onClick={handleLoginClick} className="absolute top-5 left-5 z-50 flex items-center bg-glass text-white px-3 py-1 rounded-md shadow-md">
        <User size={20} />
      </button>

      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* 타이틀 */}
      <div className="absolute sm:top-[5%] sm:left-10 top-[3%] left-3 z-40 text-gray-300 font-bold text-7xl drop-shadow-md animate-slide-up">
        <p>혼자서도</p>
        <p>편하게</p>
      </div>

      {/* 검색창 */}
      <div
        className={`
          absolute top-[22.8%] left-[7.5%] transform -translate-x-1/2 w-[85%]
          sm:top-[36.6%] sm:w-[1200px] sm:left-[8.7%]
          2xl:top-[40.5%] 2xl:w-[1400px] 2xl:left-[13.2%]
          transition-opacity duration-300
          ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 z-40 animate-slide-up'}
        `}
      >
        <form className="flex items-center bg-white rounded-3xl shadow-md px-4 py-2 border border-gray-200">
          <input
            type="search"
            placeholder="검색어를 입력해보세요!!"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg pl-2"
          />
          <button type="submit" className="text-gray-500">
            <Search size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

      {/* 본문 */}
      <div
      className="bg-white w-full rounded-t-3xl shadow-xl p-6 space-y-5 mt-[70vh] opacity-0 animate-slide-up">
      <div className="flex justify-left items-center space-x-3 mt-2"> 

  <div className="flex items-center space-x-3 mt-5 p-1">
    <FilterDropdown
      label="전체 지역"
      options={['전체 지역', '서울', '경기도', '강원도', '충청도', '전라도', '경상도']}
      selected={region}
      setSelected={setRegion}
    />
    <FilterDropdown
      label="기본 정렬"
      options={['기본 정렬', '평점 높은 순', '혼밥 점수 높은 순', '리뷰 많은 순']}
      selected={sort}
      setSelected={setSort}
    />
  </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleData.map((shop) => (
            <div key={shop.id} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition">
              <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{shop.name}</h2>
                <p className="text-gray-500 text-sm">📍 {shop.location}</p>
                <p className="text-gray-800 text-sm">⭐ {shop.rating} / 혼숙 점수 {shop.soloScore}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {shop.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-xs px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 문구 */}
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
