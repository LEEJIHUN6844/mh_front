import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';

const SleepingReview = () => {
  const { storeId } = useParams();
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ 가게 정보 가져오기
    fetch("http://localhost:8000/api/eating")
      .then(res => res.json())
      .then(data => {
        const matchedShop = data.data.find(s => s.storeId === storeId);
        setShop(matchedShop || null);
      });

    // 2️⃣ 리뷰 정보 가져오기
    fetch(`http://localhost:8000/api/eating/${storeId}/review`)
    .then(res => res.json())
    .then(data => setReviews(data.reviews || []))
    .finally(() => setLoading(false));
}, [storeId]);

  if (loading) return <p>로딩중...</p>;
  if (!shop) return <p>가게 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
      <img
        src={`/assets/혼밥/${shop.storeId}.jpg`}
        alt={shop.name}
        className="w-full aspect-w-16 aspect-h-9 rounded-xl mb-4 object-cover"
        onError={e => { e.currentTarget.src = '/assets/default.jpg'; }}
      />
      <p className="text-gray-600 mb-2">📍 {shop.address}</p>
      <p className="text-gray-500 mb-4">⭐ {shop.rating} / 혼밥 점수 {shop.soloScore}</p>

      <h2 className="text-2xl font-semibold mb-2">리뷰 ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.reviewId} className="border p-3 rounded-lg shadow-sm">
            <p className="text-gray-800">{r.reviewTxt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SleepingReview;
