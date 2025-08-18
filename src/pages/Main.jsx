import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';

const HamburgerMenu = ({ isOpen, setIsOpen }) => (
  <>
    <button onClick={() => setIsOpen(!isOpen)} className="absolute top-4 right-4 z-50 text-white p-2">
      {isOpen ? <X size={28} /> : <Menu size={30} />}
    </button>

    <div className={`fixed top-0 right-0 h-full w-[60%] sm:w-60 bg-white shadow-lg z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <ul className="p-6 space-y-4">
        <li><Link to="/" onClick={() => setIsOpen(false)}>홈</Link></li>
        <li><Link to="/eating" onClick={() => setIsOpen(false)}>혼밥</Link></li>
        <li><Link to="/playing" onClick={() => setIsOpen(false)}>혼놀</Link></li>
        <li><Link to="/sleeping" onClick={() => setIsOpen(false)}>혼숙</Link></li>
      </ul>
    </div>

    {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)} />}
  </>
);

const SwiperSection = ({ likes, keywordFilter, title, folder }) => {
  const navigate = useNavigate();
  const filteredLikes = likes.filter(item => item.keyword.includes(keywordFilter));

  return (
    <div className="w-full space-y-4 min-h-[350px] z-10">
      {/* 화면에 보여줄 타이틀 */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-700">
        {title}
      </h2>

      {filteredLikes.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] rounded-xl bg-gray-100 text-gray-500 shadow-inner">
          아직 좋아요한 가게가 없습니다 😢
        </div>
      ) : (
        <Swiper
          slidesPerView={1.5}
          spaceBetween={12}
          breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 3 } }}
          pagination={{ clickable: true }}
          mousewheel
          modules={[Pagination, Mousewheel]}
          className="w-full"
        >
          {filteredLikes.map(item => (
            <SwiperSlide key={item.storeId}>
              <div
                className="relative w-full h-[250px] rounded-xl shadow-md overflow-hidden cursor-pointer"
                onClick={() => {
                  if (item.keyword.includes("맛집")) navigate(`/store/eating/${item.storeId}`);
                  else if (item.keyword.includes("놀곳")) navigate(`/store/playing/${item.storeId}`);
                  else if (item.keyword.includes("숙소")) navigate(`/store/sleeping/${item.storeId}`);
                }}
              >
                {/* ✅ 이미지 경로는 folder prop을 사용 */}
                <img
                  src={`/assets/${folder}/${item.storeId}.jpg`}
                  alt={item.name || "default image"}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/assets/default.jpg"; }}
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white font-bold text-lg sm:text-xl">{item.name}</p>
                  <p className="text-gray-300 text-sm sm:text-base">📍 {item.address}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [data, setData] = useState({ eating: [], playing: [], sleeping: [] });
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/signup');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eatingRes, playingRes, sleepingRes] = await Promise.all([
          fetch('http://localhost:8000/api/eating').then(res => res.json()),
          fetch('http://localhost:8000/api/playing').then(res => res.json()),
          fetch('http://localhost:8000/api/sleeping').then(res => res.json()),
        ]);

        const shuffle = arr => arr.sort(() => 0.5 - Math.random());

        setData({
          eating: shuffle(eatingRes.data).slice(0, 10),
          playing: shuffle(playingRes.data).slice(0, 10),
          sleeping: shuffle(sleepingRes.data).slice(0, 10),
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
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

  return (
    <div className="relative w-full min-h-screen bg-gray-50 overflow-x-hidden">
      {/* 배경 이미지 */}
      <div
        className="fixed inset-0 h-[70vh] sm:h-[70vh] bg-center bg-cover"
        style={{ backgroundImage: "url('/assets/바다.jpg')", backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}
      ></div>

      {/* 로그인 버튼 */}
      <button onClick={handleLoginClick} className="absolute top-5 left-5 bg-glass text-black px-3 py-1 rounded-md shadow-md z-50 flex items-center">
        <User size={20} className="text-white" />
        <span className="font-bold">{isLoggedIn ? '' : ''}</span>
      </button>

      {/* 햄버거 메뉴 */}
      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* 타이틀 */}
      <div className="absolute top-[5%] left-5 z-40 text-white font-bold text-6xl sm:text-7xl space-y-2 drop-shadow-md animate-slide-up">
        <p>모험의 순간</p>
        <p>자연과 함께</p>
      </div>

      {/* Swiper 섹션 */}
      <div className="relative z-20 mt-[67vh] sm:mt-[65vh] bg-white rounded-t-3xl shadow-2xl p-6 space-y-8 animate-slide-up min-h-[600px]">
      <SwiperSection 
      likes={data.eating} 
      keywordFilter="맛집" 
      title="🍚혼밥 추천 모음!" 
      folder="혼밥" 
      />
       <SwiperSection 
        likes={data.playing} 
        keywordFilter="놀곳" 
        title="🎮 혼놀 추천 모음!" 
        folder="혼놀" 
      />
      <SwiperSection 
        likes={data.sleeping} 
        keywordFilter="숙소" 
        title="🛏️ 혼숙 추천 모음!" 
        folder="혼숙" 
      />
    </div>

   
        <MyPageButtonWithPopup />

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
