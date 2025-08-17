import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, Heart } from 'lucide-react';
import FilterDropdown from '../pages/FilterDropdown';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';

const HamburgerMenu = ({ isOpen, setIsOpen }) => (
  <>
    <button onClick={() => setIsOpen(!isOpen)} className="absolute top-4 right-4 z-50 text-white p-2">
      {isOpen ? <X size={28} /> : <Menu size={30} />}
    </button>
    <div className={`fixed top-0 right-0 h-full w-[60%] sm:w-60 bg-white shadow-lg z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
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


const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('');
  const [likedShops, setLikedShops] = useState([]);
  const navigate = useNavigate();
  
  // 가게 데이터 받아오기
  useEffect(() => {
    // 데이터를 모두 받아오고 로딩 종료
    const fetchData = async () => {
      try {
        const shopRes = await fetch("http://localhost:8000/api/eating");
        const shopData = await shopRes.json();
        setShops(shopData.data || []);
        const likeRes = await fetch("http://localhost:8000/api/mypage", { credentials: "include" });
        const likeData = await likeRes.json();
        setLikedShops(likeData.likes.map(like => like.item_name));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); // ✅ 로딩 종료
      }
    };
    fetchData();
  }, []);
  
  // 좋아요 토글
  const toggleLike = async (shop) => {
    const isLiked = likedShops.includes(shop.name);
    try {
      if (isLiked) {
        await fetch(`http://localhost:8000/api/likes?item_name=${encodeURIComponent(shop.name)}`, {
          method: "DELETE",
          credentials: "include",
        });
        setLikedShops(prev => prev.filter(name => name !== shop.name));
        alert(`${shop.name} 좋아요 취소`);
      } else {
        await fetch("http://localhost:8000/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            store_id: shop.storeId,
            keyword: shop.keyword,
            item_name: shop.name,
            address: shop.address,
            category: shop.category,
            image: `/assets/혼밥/${shop.storeId}.jpg`,
          }),
        });
        setLikedShops(prev => [...prev, shop.name]);
        alert(`${shop.name} 좋아요`);
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
      if (sort === '혼밥 점수 높은 순') return b.soloScore - a.soloScore;
      if (sort === '리뷰 많은 순') return b.review_cnt - a.review_cnt;
      return 0;
    });

    // 로그인 버튼 클릭
  const handleLoginClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/Signup');
      setIsLoggedIn(true);
      setIsLoading(false);
    }, 800);
  };

  // ✅ 로딩 화면
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
          <p className="text-gray-600 text-lg font-medium">로딩 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gray-50">
      <div
        className="fixed inset-0 h-[70vh] sm:h-[75vh] bg-center bg-cover -z-5"
        style={{ backgroundImage: "url('/assets/혼밥.jpg')", backgroundAttachment: 'fixed', backgroundRepeat: 'no-repeat' }}
      ></div>
      {/* 검색창 */}
      <div className={`absolute top-[67.5vh] left-[7.5%] w-[80vw] min-w-[85%] transition-opacity duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 z-40 animate-slide-up'}`}>
        <form className="flex items-center bg-white rounded-3xl shadow-md px-4 py-2 border border-gray-200">
          <input type="search" placeholder="검색어를 입력해보세요!!" className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-lg pl-2" />
          <button type="submit" className="text-yellow-400">
            <Search size={24} strokeWidth={3} />
          </button>
        </form>
      </div>

       {/* 로그인/회원가입 버튼 */}
        <button onClick={handleLoginClick}
          className="absolute top-5 left-5 z-50 flex items-center bg-glass text-white px-3 py-1 rounded-md shadow-md">
          <User size={20} />
        </button>

      <MyPageButtonWithPopup />
      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="fixed sm:top-[12%] sm:left-10 top-[9%] left-3 text-yellow-100 font-bold text-7xl drop-shadow-md animate-slide-up">
        <p>혼자서도</p>
        <p>맛있게</p>
      </div>

      <div className="bg-white w-full rounded-t-3xl shadow-xl p-6 space-y-5 mt-[70vh] opacity-0 animate-slide-up">
        <div className="flex items-center space-x-3 mt-5 p-1">
          <FilterDropdown label="전체 지역" options={['전체 지역','서울','경기','강원','충청','전라','경상']} selected={region} setSelected={setRegion} />
          <FilterDropdown label="기본 정렬" options={['기본 정렬','평점 높은 순','혼밥 점수 높은 순','리뷰 많은 순']} selected={sort} setSelected={setSort} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-h-[150px]">
          {filteredData.map(shop => (
            <div
              key={shop.storeId}
              className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition relative cursor-pointer"
              onClick={() => navigate(`/eating/${shop.storeId}`)}
            >
              <img src={`/assets/혼밥/${shop.storeId}.jpg`}
                alt={shop.name}
                className="w-full h-48 object-cover object-center"
                onError={e => { e.currentTarget.src = '/assets/default.jpg'; }}
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">{shop.name}</h2>
                <p className="text-gray-500 text-sm">📍 {shop.address}</p>
                <p className="text-yellow-500 text-sm">⭐ {shop.rating} / 혼밥 점수 {shop.soloScore}</p>
                <p className="text-gray-400 text-xs">{shop.category}</p>
              </div>
              <div className="absolute bottom-2 right-2">
                <button
                  className={`p-1.5 rounded-full shadow transition ${likedShops.includes(shop.name) ? 'bg-red-500 text-white' : 'bg-yellow-400 text-white'}`}
                  onClick={e => {
                    e.stopPropagation();
                    toggleLike({ name: shop.name, keyword: shop.keyword, address: shop.address, category: shop.category, storeId: shop.storeId });
                  }}
                >
                  <Heart size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
