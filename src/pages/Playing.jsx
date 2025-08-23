import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart } from 'lucide-react';
import FilterDropdown from '../pages/FilterDropdown';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';
import LogoutModalPage from './Logout.jsx';

// 햄버거 메뉴 컴포넌트
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

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [plays, setPlays] = useState([]);
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [likedShops, setLikedShops] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // 로그인 상태 확인
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

  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/Signup');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  // 데이터 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playRes = await fetch("http://localhost:8000/playing");
        const playData = await playRes.json();
        setPlays(playData.data || []);

        const likeRes = await fetch("http://localhost:8000/mypage", { credentials: "include" });
        const likeData = await likeRes.json();
        setLikedShops(likeData.likes.map(like => like.item_name));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 좋아요 토글
  const toggleLike = async (play) => {
    const isLiked = likedShops.includes(play.storename);
    try {
      if (isLiked) {
        await fetch(`http://localhost:8000/likes?item_name=${encodeURIComponent(play.storename)}`, {
          method: "DELETE",
          credentials: "include",
        });
        setLikedShops(prev => prev.filter(name => name !== play.storename));
      } else {
        await fetch("http://localhost:8000/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            store_id: play.storeid,
            keyword: play.keyword,
            item_name: play.storename,
            address: play.address,
            category: play.category,
            image: play.img_url || `/assets/혼놀/${play.storeid}.jpg`,
          }),
        });
        setLikedShops(prev => [...prev, play.storename]);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  // 검색 submit
  const handleSearch = (e) => {
    e.preventDefault();
    // searchTerm 상태가 이미 filteredData에 반영됨
  };

  const filteredData = plays
    .filter(play => region && region !== '전체 지역' ? play.address.includes(region) : true)
    .sort((a, b) => {
      if (sort === '평점 높은 순') return b.rating - a.rating;
      if (sort === '혼놀 점수 높은 순') return b.honbab_cnt - a.honbab_cnt;
      if (sort === '리뷰 많은 순') return b.review_cnt - a.review_cnt;
      return 0;
    });

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
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50">
      {/* 상단 배경 */}
      <div
        className="fixed inset-0 h-[70vh] sm:h-[75vh] bg-center bg-cover -z-5"
        style={{
          backgroundImage: "url('/assets/혼놀.jpg')",
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      {/* 검색창 */}
      <div className={`absolute top-[68vh] left-[7.5%] w-[80vw] min-w-[85%] transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 z-40 animate-slide-up'}`}>
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-3xl shadow-md px-4 py-2 border border-gray-200">
          <input
            type="search"
            placeholder="검색어를 입력해보세요!!"
            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg pl-2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-sky-500">
            <Search size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

      {/* 마이페이지 버튼 */}
      <MyPageButtonWithPopup />

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

      {/* 타이틀 */}
      <div className="fixed sm:top-[3%] sm:left-10 top-[5%] left-3 text-sky-200 font-bold text-7xl sm:text-8xl drop-shadow-md animate-slide-up">
        <p>혼자서도</p>
        <p>재밌게</p>
      </div>

      {/* 가게 리스트 */}
      <div className="bg-white w-full rounded-t-3xl shadow-xl p-6 space-y-5 mt-[70vh] opacity-0 animate-slide-up">
        <div className="flex items-center space-x-3 mt-5 p-1">
          <FilterDropdown
            label="전체 지역"
            options={['전체 지역','서울 은평구','덕양구','일산동구','일산서구']}
            selected={region}
            setSelected={setRegion}
          />
          <FilterDropdown
            label="기본 정렬"
            options={['기본 정렬', '평점 높은 순', '혼놀 점수 높은 순', '리뷰 많은 순']}
            selected={sort}
            setSelected={setSort}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-h-[150px]">
          {filteredData.map(play => (
            <div
              key={play.storeid}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition relative cursor-pointer"
              onClick={() => navigate(`/playing/${play.storeid}`)}
            >
              <img src={`/assets/혼놀/${play.storeid}.jpg`} alt={play.storename} className="w-full h-48 object-cover object-center" onError={e => e.currentTarget.src = '/assets/default.jpg'} />
              <div className="p-4">
                <h2 className="text-lg font-bold">{play.storename}</h2>
                <p className="text-gray-500 text-sm">📍 {play.address}</p>
                <p className="text-sky-500 text-sm">⭐ {play.rating} / 혼놀 점수 {play.honbab_cnt}</p>
                <p className="text-gray-400 text-xs">{play.category}</p>
              </div>
              <div className="absolute bottom-2 right-2">
                <button
                  className={`p-1.5 rounded-full shadow transition ${likedShops.includes(play.storename) ? 'bg-red-500 text-white' : 'bg-sky-400 text-white'}`}
                  onClick={e => {
                    e.stopPropagation();
                    toggleLike({
                      storename: play.storename,
                      keyword: play.keyword,
                      address: play.address,
                      category: play.category,
                      storeid: play.storeid,
                    });
                  }}
                >
                  <Heart size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 하단문구 */}
        <div className="mt-10 p-4 bg-glass opacity-20 w-full pl-6">
          <div className="w-full h-px bg-black mb-2" />
          <p className="text-black font-semibold text-lg text-left">
            멋쟁이사자처럼 13기 해커톤 프로젝트 <br />
            😎우리조잘했조 - 이지훈 김정현 송원영<br />
            프로젝트 기간: 2025.08.05 ~ 2025.08.26
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
