import { useState } from 'react'
import { MapPin, ChartColumnStacked, ChartBarStacked, Shuffle } from 'lucide-react'
import FilterDropdown from './FilterDropdown_Load.jsx'

export default function Loadmap() {
  // 현재 선택된 지역 상태. 초기값은 '전체 지역'.
  const [selectedRegion, setSelectedRegion] = useState('전체 지역')
  // 체크박스 카테고리 상태 초기값은 모두 선택 X
  const [checkboxCategories, setCheckboxCategories] = useState({
    혼밥: false,
    혼놀: false,
    혼숙: false
  })
  // 스위치 카테고리 상태 초기값은 모두 선택 X
  const [switchCategories, setSwitchCategories] = useState({
    혼밥: false,
    혼놀: false,
    혼숙: false
  })
  // 스위치를 열었을때 체크박스 상태 초기값은 모두 선택 X
  const [switchCheckboxes, setSwitchCheckboxes] = useState({
    혼밥: { 혼밥: false, 혼놀: false, 혼숙: false },
    혼놀: { 혼밥: false, 혼놀: false, 혼숙: false },
    혼숙: { 혼밥: false, 혼놀: false, 혼숙: false }
  })
  // 지역 옵션 목록
  const regionOptions = [
    { value: '전체 지역', label: '전체 지역' },
    { value: '서울특별시 은평구', label: '서울특별시 은평구' },
    { value: '경기도', label: '경기도' },
    { value: '강원도', label: '강원도' },
    { value: '충청도', label: '충청도' },
    { value: '경상도', label: '경상도' },
    { value: '전라도', label: '전라도' }
  ]
  // 체크박스 상태 변경 
  const handleCheckboxChange = (category, checked) => {
    setCheckboxCategories(prev => ({
      ...prev,
      [category]: checked
    }))
  }
  // 스위치 상태 변경
  const handleSwitchChange = (category, checked) => {
    setSwitchCategories(prev => ({
      ...prev,
      [category]: checked
    }))
  }
  // 스위치 내 체크박스 상태 변경
  const handleSwitchCheckboxChange = (switchCategory, checkboxCategory, checked) => {
    setSwitchCheckboxes(prev => ({
      ...prev,
      [switchCategory]: {
        ...prev[switchCategory],
        [checkboxCategory]: checked
      }
    }))
  }
  
  return (
    // 배경 그라데이션 및 최소 높이 설정
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      {/* 중앙 정렬 및 너비 최대*/}
      <div className="w-full max-w-3xl mx-auto">
        {/* 배경색 설정 및 애니메이션 효과 설정 */}
        <div className="bg-white shadow-lg rounded-2xl p-8 min-h-[800px] animate-slide-up">
          {/* 인사말 */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-green-600">
              안녕하세요, 로디에요 :) 🌿
            </h1>
            <p className="text-sm text-gray-600">
              원하는 조건을 선택하고 나만의 로드맵을 만들어보세요!
            </p>
          </div>

          {/* 필터 드롭다운을 이용한 지역 선택창 */}
          <div className="mb-6">
            <FilterDropdown
              label={<span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 지역</span>}
              options={regionOptions}
              value={selectedRegion}
              onChange={setSelectedRegion}
              placeholder="지역을 선택하세요"
            />
          </div>

          {/* 체크박스 카테고리 */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <ChartColumnStacked className="w-4 h-4" /> 카테고리
            </h2>
            <div className="flex items-center justify-between mt-2">
              {Object.entries(checkboxCategories).map(([category, checked]) => (
                <div key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`checkbox-${category}`}
                    checked={checked}
                    onChange={(e) => handleCheckboxChange(category, e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor={`checkbox-${category}`} className="text-sm text-gray-700 cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* OR */}
          <div className="text-center text-gray-400 my-5">or</div>

          {/* 스위치 카테고리 */}
          <div>
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
                        {['혼밥', '혼놀', '혼숙'].map((checkboxCategory) => (
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
        {/* 선택 미리보기 */}
        <div className="mt-8 p-3 bg-green-50 border border-green-100 rounded-lg">
        <h3 className="text-md font-semibold text-green-700 mb-2">선택 미리보기</h3>
        <p className="text-xs text-gray-500">
            지역: {selectedRegion}
        </p>
        <p className="text-xs text-gray-500">
            체크박스: {Object.entries(checkboxCategories)
            .filter(([_, checked]) => checked)
            .map(([category]) => category)
            .join(', ') || '선택 없음'}
        </p>
        <p className="text-xs text-gray-500">
            스위치: {Object.entries(switchCategories)
            .filter(([_, checked]) => checked)
            .map(([category]) => category)
            .join(', ') || '선택 없음'}
        </p>
        <p className="text-xs text-gray-500">
            스위치별 체크박스: {Object.entries(switchCheckboxes)
            .map(([switchCategory, checkboxes]) => {
            // 선택된 하위 체크박스만 필터링
            const checkedItems = Object.entries(checkboxes)
            .filter(([_, checked]) => checked)
            .map(([checkboxCategory]) => checkboxCategory);

            return `${switchCategory}: ${checkedItems.length > 0 ? checkedItems.join(', ') : '선택 없음'}`;
            })
            .join(' | ')}
        </p>

        </div>



          {/* 버튼 */}
          <div className="pt-6 flex gap-3">
            <button 
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-transform transform hover:scale-105"
              onClick={() => {
                console.log('선택된 지역:', selectedRegion)
                console.log('체크박스 카테고리:', checkboxCategories)
                console.log('스위치 카테고리:', switchCategories)
                console.log('스위치별 체크박스:', switchCheckboxes)
              }}
            >
              로드맵 만들어보기!!
            </button>
            
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center gap-1"
              onClick={() => {
                const randomRegion = regionOptions[Math.floor(Math.random() * regionOptions.length)].value
                setSelectedRegion(randomRegion)
              }}
            >
              <Shuffle className="w-4 h-4" /> 랜덤
            </button>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-5 text-left text-xs text-gray-400">
          멋쟁이사자처럼 13기 해커톤 프로젝트 <br />
          😎 우리조잘했조 - 이지훈 김정현 송원영 <br />
          프로젝트 기간: 2025.00.00 ~ 2025.08.26
        </div>
      </div>
    </div>
  )
}
