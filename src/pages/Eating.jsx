import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Heart } from 'lucide-react';
import FilterDropdown from '../pages/FilterDropdown';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';
import LogoutModalPage from './Logout.jsx';

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
  const [shops, setShops] = useState([]);
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('');
  const [likedShops, setLikedShops] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedShops, setSearchedShops] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const checkLogin = async () => {
        try {
          const sessionRes = await fetch('http://localhost:8000/session', {
            credentials: 'include',
          });
          const sessionData = await sessionRes.json();
    
          if (!sessionData.authenticated) {
            setIsLoggedIn(false);
            return;
          }
    
          const res = await fetch('http://localhost:8000/mypage', {
            credentials: 'include',
          });
          setIsLoggedIn(res.ok);
        } catch {
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

  useEffect(() => {
      const fetchData = async () => {
        try {
          const shopRes = await fetch("http://localhost:8000/eating");
          const shopData = await shopRes.json();
          setShops(shopData.data || []);
    
          if (isLoggedIn) {
            const likeRes = await fetch("http://localhost:8000/mypage", { credentials: "include" });
            const likeData = await likeRes.json();
            setLikedShops((likeData.likes || []).map(like => like.item_name));
          } else {
            setLikedShops([]);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [isLoggedIn]);

  const toggleLike = async (shop) => {
    const isLiked = likedShops.includes(shop.storename);
    try {
      if (isLiked) {
        await fetch(`http://localhost:8000/likes?item_name=${encodeURIComponent(shop.storename)}`, {
          method: "DELETE",
          credentials: "include",
        });
        setLikedShops(prev => prev.filter(name => name !== shop.storename));
      } else {
        await fetch("http://localhost:8000/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            store_id: shop.storeid,
            keyword: shop.keyword,
            item_name: shop.storename,
            address: shop.address,
            category: shop.category,
            image: `/assets/혼밥/${shop.storeid}.jpg`,
          }),
        });
        setLikedShops(prev => [...prev, shop.storename]);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  const filteredData = shops
    .filter(shop => region && region !== '전체 지역' ? shop.address.includes(region) : true)
    .sort((a, b) => {
      if (sort === '평점 높은 순') return b.rating - a.rating;
      if (sort === '혼밥 점수 높은 순') return b.honbab_cnt - a.honbab_cnt;
      if (sort === '리뷰 많은 순') return b.review_cnt - a.review_cnt;
      return 0;
    });

  const handleSearch = () => {
    const result = shops.filter(shop =>
      shop.storename.includes(searchQuery)
    );
    setSearchedShops(result);
  };

  if (isLoading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-10 w-10 text-green-500 mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-gray-600 text-lg font-medium">로딩 중입니다...</p>
      </div>
    </div>
  );

  const displayData = searchedShops.length > 0 ? searchedShops : filteredData;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50">
      <div
        className="fixed inset-0 h-[70vh] sm:h-[75vh] bg-center bg-cover -z-5"
        style={{ backgroundImage: "url('/assets/혼밥.jpg')", backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}
      ></div>

      <div className={`absolute top-[67.5vh] left-[7.5%] w-[80vw] min-w-[85%] transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 z-40 animate-slide-up'}`}>
        <form
          className="flex items-center bg-white rounded-3xl shadow-md px-4 py-2 border border-gray-200"
          onSubmit={(e) => {e.preventDefault();handleSearch();
          }}
        >
          <input
            type="search"
            placeholder="검색어를 입력해보세요!!"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg pl-2"
          />
          <button type="submit" className="text-yellow-400">
            <Search size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

      <MyPageButtonWithPopup />
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

      <div className="fixed sm:top-[3%] sm:left-10 top-[5%] left-3 text-yellow-100 font-bold text-7xl sm:text-8xl drop-shadow-md animate-slide-up">
        <p>혼자서도</p>
        <p>맛있게</p>
      </div>

      <div className="bg-white w-full rounded-t-3xl shadow-xl p-6 space-y-5 mt-[70vh] opacity-0 animate-slide-up">
        <div className="flex items-center space-x-3 mt-5 p-1">
          <FilterDropdown label="전체 지역" options={['전체 지역','서울 은평구','고양시 덕양구','고양시 일산동구','고양시 일산서구']} selected={region} setSelected={setRegion} />
          <FilterDropdown label="기본 정렬" options={['기본 정렬','평점 높은 순','혼밥 점수 높은 순','리뷰 많은 순']} selected={sort} setSelected={setSort} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-h-[150px]">
          {displayData.map(shop => (
            <div
              key={shop.storeid}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition relative cursor-pointer"
              onClick={() => navigate(`/eating/${shop.storeid}`)}
            >
              <img
                src={`/assets/혼밥/${shop.storeid}.jpg`}
                alt={shop.storename}
                className="w-full h-48 object-cover object-center"
                onError={e => { e.currentTarget.src = '/assets/default.jpg'; }}
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">{shop.storename}</h2>
                <p className="text-gray-500 text-sm">📍 {shop.address}</p>
                <p className="text-yellow-500 text-sm">⭐ {shop.rating} / 혼밥 점수 {shop.honbab_cnt}</p>
                <p className="text-gray-400 text-xs">{shop.category}</p>
              </div>
              <div className="absolute bottom-2 right-2">
                <button
                  className={`p-1.5 rounded-full shadow transition ${likedShops.includes(shop.storename) ? 'bg-red-500 text-white' : 'bg-yellow-400 text-white'}`}
                  onClick={e => {
                    e.stopPropagation();
                    toggleLike(shop);
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
