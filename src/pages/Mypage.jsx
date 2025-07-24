import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function HamburgerMenu({ isOpen, setIsOpen }) {
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-50 text-green p-2"
      >
        {isOpen ? <X size={28} /> : <Menu size={30} />}
      </button>

      <div
        className={`fixed top-0 right-0 h-full w-[60%] sm:w-60 bg-white shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <ul className="p-6 space-y-4">
          <li><Link to="/" onClick={() => setIsOpen(false)}>홈</Link></li>
          <li><Link to="/Eating" onClick={() => setIsOpen(false)}>혼밥</Link></li>
          <li><Link to="/Playing" onClick={() => setIsOpen(false)}>혼놀</Link></li>
          <li><Link to="/Sleeping" onClick={() => setIsOpen(false)}>혼숙</Link></li>
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

function Mypage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <p>MyPage</p>
      <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default Mypage;
