import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';
import LogoutModalPage from './Logout.jsx';

// 햄버거 메뉴
const HamburgerMenu = ({ isOpen, setIsOpen, handleLoginClick, handleLogoutClick, isLoggedIn }) => (
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
              <li className="flex justify-between items-center border-b border-gray-300 pb-2">
                <Link to="/" onClick={() => setIsOpen(false)}>홈</Link>
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
              <li><Link to="/eating" onClick={() => setIsOpen(false)}>혼밥</Link></li>
              <li><Link to="/playing" onClick={() => setIsOpen(false)}>혼놀</Link></li>
              <li><Link to="/sleeping" onClick={() => setIsOpen(false)}>혼숙</Link></li>
            </ul>
          </div>
    {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsOpen(false)} />}
  </>
);


// SwiperSection 컴포넌트
const SwiperSection = ({ likes, keywordFilter, title }) => {
  const navigate = useNavigate();
  const filteredLikes = likes.filter(item => item.keyword.includes(keywordFilter));

  return (
    <div className="w-full space-y-4 min-h-[250px]"> {/* ← 높이 고정 */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-700">{title}</h2>

      {filteredLikes.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] rounded-xl bg-gray-100 text-gray-500 shadow-inner">
          아직 좋아요한 가게가 없습니다 😢
        </div>
      ) : (
        <Swiper
          slidesPerView={1.5}
          spaceBetween={12}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          mousewheel
          modules={[Pagination, Mousewheel]}
          className="w-full"
        >
          {filteredLikes.map(item => (
            <SwiperSlide key={item.store_id}>
              <div
                className="relative w-full h-[200px] rounded-xl shadow-md overflow-hidden cursor-pointer"
                onClick={() => {
                  if (item.keyword.includes("맛집")) navigate(`/store/eating/${item.store_id}`);
                  else if (item.keyword.includes("놀곳")) navigate(`/store/playing/${item.store_id}`);
                  else if (item.keyword.includes("숙소")) navigate(`/store/sleeping/${item.store_id}`);
                }}          
              >
                <img
                  src={item.image || "/assets/default.jpg"}
                  alt={item.item_name || "default image"}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/assets/default.jpg"; }}
                />


                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white font-bold text-lg sm:text-xl">{item.item_name}</p>
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
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 초기값 true
  const [likes, setLikes] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // 마이페이지 데이터 fetch
  useEffect(() => {
    fetch("http://localhost:8000/mypage", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("로그인 필요");
        return res.json();
      })
      .then(data => {
        setUserName(data.UserName);
        setLikes(data.likes || []);
        setIsLoading(false); // 데이터 로딩 완료
      })
      .catch(() => {
        setIsLoading(false); // 실패해도 로딩 종료
        navigate("/Signup");
      });
  }, [navigate]);

  // 로그인 상태 확인
  useEffect(() => {
    const run = async () => {
      try {
        const s = await fetch("http://localhost:8000/session", { credentials: "include" });
        const { authenticated } = await s.json();
  
        if (!authenticated) {
          setIsLoggedIn(false);
          setIsLoading(false);
          navigate("/Signup");
          return;
        }
  
        setIsLoggedIn(true);
  
        const res = await fetch("http://localhost:8000/mypage", { credentials: "include" });
        const data = await res.json();
        setUserName(data.UserName);
        setLikes(data.likes || []);
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [navigate]);

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/Signup');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  // 로그아웃 버튼 클릭
  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

 
  // 로딩 화면
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-green-500 mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          <p className="text-gray-600 text-lg font-medium">로딩 중입니다...</p>
        </div>
      </div>
    );
  }
  
  // Mypage 페이지 JSX
  return (
    <div className="relative w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <MyPageButtonWithPopup />
      {/* 배경 이미지 */}
      <div className="w-full h-[85vh] relative">
        <img src="/assets/마이페이지.jpg" alt="마이페이지 배경" className="absolute top-0 left-0 w-full h-full object-cover" />
        {/* 햄버거 메뉴 */}
      <HamburgerMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleLoginClick={handleLoginClick}
        handleLogoutClick={handleLogoutClick}
        isLoggedIn={isLoggedIn}
      />

        {showLogoutModal && (
          <LogoutModalPage 
          setShowModal={setShowLogoutModal} 
          setIsLoggedIn={setIsLoggedIn} 
        />
      )}
        <div className="absolute top-[15%] sm:top-[12%] left-5 text-white font-bold text-5xl sm:text-7xl drop-shadow-md z-10 animate-slide-up">
          {userName ? `${userName}님 환영합니다` : '마이페이지'}
        </div>
      </div>

      {/* 큰 div 박스 */}
      <div className="relative z-20 -mt-10 bg-white rounded-t-3xl shadow-2xl p-6 space-y-8 animate-slide-up">
        <SwiperSection likes={likes} keywordFilter="맛집" title="🍚혼밥 좋아요 목록" />
        <SwiperSection likes={likes} keywordFilter="놀곳" title="🎮혼놀 좋아요 목록" />
        <SwiperSection likes={likes} keywordFilter="숙소" title="🛏️혼숙 좋아요 목록" />
      </div>

      {/* 하단 문구 */}
      <div className="mt-10 p-4 bg-glass opacity-20 w-full pl-6">
        <div className="w-full h-px bg-black mb-2" />
        <p className="text-black font-semibold text-lg text-left">
          멋쟁이사자처럼 13기 해커톤 프로젝트 <br />
          😎우리조잘했조 - 이지훈 김정현 송원영<br />
          프로젝트 기간: 2025.08.05 ~ 2025.08.26
        </p>
      </div>
    </div>
  );
};

export default Main;
