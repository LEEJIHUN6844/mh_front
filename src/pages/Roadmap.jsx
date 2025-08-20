import { useState, useEffect } from 'react';
import { MapPin, ChartBarStacked, Shuffle, Menu, X } from 'lucide-react';
import FilterDropdown from './FilterDropdown_Load.jsx';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModalPage from './Logout.jsx';
import MyPageButtonWithPopup from './Mypage_loadmap_button.jsx';

// ---------------- 햄버거 메뉴 ----------------
const HamburgerMenu = ({ isOpen, setIsOpen, handleLoginClick, handleLogoutClick, isLoggedIn }) => (
  <>
    <button 
      onClick={() => setIsOpen(!isOpen)} 
      className="absolute top-4 right-4 z-50 text-gray-400 p-2"
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

// ---------------- Loadmap 페이지 ----------------
export default function Loadmap() {
  const navigate = useNavigate();

  // 상태
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('전체 지역');
  const [switchCategories, setSwitchCategories] = useState({ 혼밥: false, 혼놀: false, 혼숙: false });
  const [switchCheckboxes, setSwitchCheckboxes] = useState({
    혼밥: { 혼밥: false, 혼놀: false, 혼숙: false },
    혼놀: { 혼밥: false, 혼놀: false, 혼숙: false },
    혼숙: { 혼밥: false, 혼놀: false, 혼숙: false }
  });
  const [selectedDays, setSelectedDays] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const regionOptions = [
    { value: '전체 지역', label: '전체 지역' },
    { value: '서울특별시 은평구', label: '서울특별시 은평구' },
    { value: '덕양구', label: '덕양구' },
    { value: '일산동구', label: '일산동구' },
    { value: '일산서구', label: '일산서구' },
  ];

  // ---------------- 스위치 핸들러 ----------------
  const handleSwitchChange = (category, checked) => {
    setSwitchCategories(prev => ({ ...prev, [category]: checked }));
  };

  const handleSwitchCheckboxChange = (switchCategory, checkboxCategory, checked) => {
    setSwitchCheckboxes(prev => ({
      ...prev,
      [switchCategory]: { ...prev[switchCategory], [checkboxCategory]: checked }
    }));
  };

  // ---------------- 로그인 상태 체크 ----------------
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch('http://localhost:8000/mypage', {
          method: 'GET',
          credentials: 'include', // 쿠키 전송
        });
        setIsLoggedIn(res.ok);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  // ---------------- 버튼 핸들러 ----------------
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8 min-h-[800px] animate-slide-up">
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-green-600">안녕하세요, 로디에요 :) 🌿</h1>
            <p className="text-sm text-gray-600">원하는 조건을 선택하고 나만의 로드맵을 만들어보세요!</p>
          </div>

          {/* 지역 필터 */}
          <div className="mb-6">
            <FilterDropdown
              label={<span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 지역</span>}
              options={regionOptions}
              value={selectedRegion}
              onChange={setSelectedRegion}
              placeholder="지역을 선택하세요"
            />
          </div>

          {/* 스위치 카테고리 */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <ChartBarStacked className="w-4 h-4" /> 카테고리
            </h2>
            <div className="space-y-6 mt-3">
              {Object.entries(switchCategories).map(([category, checked]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => handleSwitchChange(category, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                  {checked && (
                    <div className="ml-4 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        {['혼밥', '혼놀', '혼숙'].map(checkboxCategory => (
                          <div key={`${category}-${checkboxCategory}`} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`switch-checkbox-${category}-${checkboxCategory}`}
                              checked={switchCheckboxes[category][checkboxCategory]}
                              onChange={(e) => handleSwitchCheckboxChange(category, checkboxCategory, e.target.checked)}
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor={`switch-checkbox-${category}-${checkboxCategory}`} className="text-sm text-gray-700 cursor-pointer">
                              {checkboxCategory}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 슬라이더 */}
          <div className="mb-6 mt-8">
            <h2 className="text-base font-semibold text-gray-700 flex items-center gap-2">
              일수를 선택해주세요!
            </h2>
            <div className="relative w-full h-3 mt-2 bg-green-100 rounded-full">
              <div 
                className="absolute left-0 top-0 h-3 bg-green-300 rounded-full transition-all duration-200"
                style={{ width: `${((selectedDays-1)/(7-1))*100}%` }}
              />
              <div
                className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full shadow-lg cursor-pointer"
                style={{ left: `${((selectedDays-1)/(7-1))*100}%` }}
                onMouseDown={(e) => {
                  const slider = e.currentTarget.parentElement;
                  const onMouseMove = (ev) => {
                    const rect = slider.getBoundingClientRect();
                    let percent = (ev.clientX - rect.left) / rect.width;
                    percent = Math.max(0, Math.min(1, percent));
                    setSelectedDays(Math.round(percent * (7-1) + 1));
                  };
                  const onMouseUp = () => {
                    window.removeEventListener('mousemove', onMouseMove);
                    window.removeEventListener('mouseup', onMouseUp);
                  };
                  window.addEventListener('mousemove', onMouseMove);
                  window.addEventListener('mouseup', onMouseUp);
                }}
              />
            </div>
            <div className="text-sm text-gray-700 text-right mt-1">{selectedDays}일</div>
          </div>

          {/* 선택 미리보기 */}
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
            <h3 className="text-md font-semibold text-green-700 mb-2">선택 미리보기</h3>
            <p className="text-xs text-gray-500">지역: {selectedRegion}</p>
            <p className="text-xs text-gray-500">
              스위치: {Object.entries(switchCategories).filter(([_, checked]) => checked).map(([category]) => category).join(', ') || '선택 없음'}
            </p>
            <p className="text-xs text-gray-500">
              스위치별 체크박스: {Object.entries(switchCheckboxes)
                .map(([switchCategory, checkboxes]) => {
                  const checkedItems = Object.entries(checkboxes).filter(([_, checked]) => checked).map(([name]) => name);
                  return `${switchCategory}: ${checkedItems.length > 0 ? checkedItems.join(', ') : '선택 없음'}`;
                })
                .join(' | ')}
            </p>
            <p className="text-xs text-gray-500">선택 일수: {selectedDays}일</p>
          </div>

          {/* 버튼 */}
          <div className="pt-6 flex gap-3">
            <button 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-transform transform hover:scale-105"
              onClick={() => console.log('선택:', { selectedRegion, switchCategories, switchCheckboxes, selectedDays })}
            >
              로드맵 만들어보기!!
            </button>
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-1"
              onClick={() => setSelectedRegion(regionOptions[Math.floor(Math.random() * regionOptions.length)].value)}
            >
              <Shuffle className="w-4 h-4" /> 랜덤
            </button>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-5 text-left text-xs text-gray-400">
          멋쟁이사자처럼 13기 해커톤 프로젝트 <br />
          😎 우리조잘했조 - 이지훈 김정현 송원영 <br />
          프로젝트 기간: 2025.08.06 ~ 2025.08.26
        </div>
      </div>

      {/* 햄버거 메뉴, 모달, 마이페이지 버튼 */}
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
      
      <MyPageButtonWithPopup />
    </div>
  );
}
