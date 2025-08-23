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

  // ---------------- 상태 ----------------
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('전체 지역');
  const [switchCategories, setSwitchCategories] = useState({ 혼밥: false, 혼놀: false, 혼숙: false });
  const [switchCheckboxes, setSwitchCheckboxes] = useState({
    혼밥: { 한식:false, 일식:false, 양식:false, 고기:false, 디저트:false },
    혼놀: { 카페:false, 공원:false, 도보:false, 박물관:false },
    혼숙: { 캠핑:false, 야영:false, 펜션:false, 호텔:false, 모텔:false }
  });
  const [selectedDays, setSelectedDays] = useState(1);
  const [roadmap, setRoadmap] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const regionOptions = [
    { value: '전체 지역', label: '전체 지역' },
    { value: '은평구', label: '서울 특별시 은평구' },
    { value: '덕양구', label: '경기도 덕양구' },
    { value: '일산동구', label: '경기도 일산동구' },
    { value: '일산서구', label: '경기도 일산서구' },
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

  // ---------------- 로드맵 API 호출 ----------------
  const handleRoadmapClick = async () => {
    try {
      const kinds = Object.entries(switchCategories)
        .filter(([_, checked]) => checked)
        .map(([category]) => category);

      if (kinds.length === 0) {
        alert("카테고리를 최소 하나 선택해주세요.");
        return;
      }

      const keywords = {};
      kinds.forEach(kind => {
        const checkedItems = Object.entries(switchCheckboxes[kind])
          .filter(([_, checked]) => checked)
          .map(([name]) => name);
        keywords[kind] = checkedItems;
      });

      const payload = {
        location: selectedRegion,
        nights: selectedDays - 1,
        kinds: kinds,
        keywords: keywords
      };

      console.log("[요청 payload]", payload);

      setIsLoading(true);
      const res = await fetch("http://localhost:8000/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include"
      });      

      console.log("[응답 status]", res.status);
      const data = await res.json();
      console.log("[응답 body]", data);

      if (data.roadmap && Array.isArray(data.roadmap)) {
        setRoadmap(data.roadmap);
      } else {
        setRoadmap([]);
        alert("AI가 적합한 로드맵을 생성하지 못했습니다.");
      }
    } catch (err) {
      console.error("AI 로드맵 호출 실패:", err);
      alert("AI 로드맵 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- 로그인 체크 ----------------
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

  // ---------------- 렌더링 ----------------
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
                    <div className="ml-4 pl-4 border-l-2 border-gray-200 mt-2">
                      <div className="grid grid-cols-3 gap-2">
                        {(category === "혼밥" ? ["한식","일식","양식","고기","디저트"] :
                          category === "혼놀" ? ["카페","공원","도보","박물관"] :
                          ["캠핑","야영","펜션","호텔","모텔"]
                        ).map((checkboxCategory, idx) => (
                          <div key={`${category}-${checkboxCategory}`} className="flex items-center gap-1">
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

          {/* 버튼 */}
          <div className="pt-6 flex gap-3">
            <button 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-transform transform hover:scale-105"
              onClick={handleRoadmapClick}
              disabled={isLoading}
            >
              {isLoading ? "생성중..." : "로드맵 만들어보기!!"}
            </button>
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-1"
              onClick={() => setSelectedRegion(regionOptions[Math.floor(Math.random() * regionOptions.length)].value)}
            >
              <Shuffle className="w-4 h-4" /> 랜덤
            </button>
          </div>

         {/* ---------------- 로드맵 출력 ---------------- */}
        {roadmap && roadmap.length > 0 ? (
  roadmap.map((dayPlan, i) => (
    <div
      key={dayPlan.day || i}
      className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200"
    >
      <h3 className="font-bold text-lg mb-3">Day {dayPlan.day || i + 1}</h3>

      {dayPlan.ai_summary && (
        <div className="bg-green-50 text-green-700 text-sm font-medium p-3 rounded-md mb-4">
          🤖 AI 간단 요약: {dayPlan.ai_summary}
        </div>
      )}

      {dayPlan.plan && dayPlan.plan.length > 0 ? (
        <div className="space-y-4">
          {dayPlan.plan.map((item, idx) => (
            <dl
              key={idx}
              className="bg-white p-3 rounded-md border border-gray-200"
            >
              <dt className="font-semibold text-gray-800">• 가게 이름:{item.storename}</dt>
            
              <dt className="font-semibold text-gray-800 mt-1">• 주소:{item.address}</dt>

              {item.rating && (
                <>
                  <dt className="font-semibold text-gray-800 mt-1">• 평점:{item.rating}</dt>
                </>
              )}

              {item.hon0_index_final && (
                <>
                <dt className="font-semibold text-gray-800 mt-1">• 혼0지수:{item.hon0_index_final}점</dt>
                <dd className="ml-2 w-full">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-green-500"
                    style={{ width: `${item.hon0_index_final}%` }}
                  ></div>
                </div>      
              </dd>
            </>
          )}

              {item.summary_bullets && (
                <>
                  <dt className="font-semibold text-gray-800 mt-1">• 방문객 후기: ⬇️</dt>
                  <dd className="ml-2 text-gray-700">{item.summary_bullets}</dd>
                </>
              )}
            </dl>
          ))}
        </div>
      ): (
        <p className="text-gray-500 text-sm">해당 날짜에 대한 로드맵이 없습니다.</p>
      )}
    </div>
  ))
) : (
  <p className="mt-4 text-gray-400 text-sm text-center">로드맵이 아직 없습니다.</p>
)}


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
  </div>
  );
}
