import React, { useEffect, useState } from 'react';

const PageWithLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 0.8초 후 로딩 종료
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer); // cleanup
  }, []);
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          {/* 로딩 아이콘 */}
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
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">📄 페이지 로딩 완료!</h1>
      <p>본문</p>
    </div>
  );
};

export default PageWithLoader;
