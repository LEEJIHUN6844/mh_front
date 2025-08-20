import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';

const SleepingReview = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    // 1️⃣ 가게 정보 가져오기
    fetch("http://localhost:8000/sleeping")
      .then(res => res.json())
      .then(data => {
        const matchedShop = data.data.find(s => s.storeid === storeId);
        setShop(matchedShop || null);
      });

    // 2️⃣ 리뷰 정보 가져오기
    fetch(`http://localhost:8000/sleeping/${storeId}/review`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .finally(() => setLoading(false));
  }, [storeId]);

  if (loading) return <p>로딩중...</p>;
  if (!shop) return <p>가게 정보를 찾을 수 없습니다.</p>;

  // 페이지네이션 계산
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* 제목 + 뒤로가기 */}
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-3xl font-bold">{shop.storename}</h1>
      </div>

      <img
        src={`/assets/혼숙/${shop.storeid}.jpg`}
        alt={shop.storename}
        className="w-full aspect-w-16 aspect-h-9 rounded-xl mb-4 object-cover"
        onError={e => { e.currentTarget.src = '/assets/default.jpg'; }}
      />
      <p className="text-gray-600 mb-2">📍 {shop.address}</p>
      <p className="text-gray-500 mb-4">⭐ {shop.rating} / 혼숙 점수 {shop.honbab_cnt}</p>

      <h2 className="text-2xl font-semibold mb-2">리뷰 ({reviews.length})</h2>
      <div className="space-y-4 mb-4">
        {currentReviews.map(r => (
          <div key={r.reviewid} className="border p-3 rounded-lg shadow-sm">
            <p className="text-gray-800">{r.reviewtxt}</p>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border ${
                currentPage === i + 1 ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SleepingReview;
