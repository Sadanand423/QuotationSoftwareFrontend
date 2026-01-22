import React, { useState } from 'react';
import mainlogo from '../../assets/mainlogo.webp';
import LoginModal from '../login/LoginSelection';

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="flex items-center gap-3">
              <img src={mainlogo} alt="Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-white">QuotationSoftware</span>
            </a>
            
            {/* Desktop Menu */}
            <ul className="hidden md:flex gap-8">
              <li><a href="#about" className="text-white font-medium hover:text-yellow-300 transition-colors">About</a></li>
              <li><a href="#features" className="text-white font-medium hover:text-yellow-300 transition-colors">Features</a></li>
              <li><a href="#contact" className="text-white font-medium hover:text-yellow-300 transition-colors">Contact Us</a></li>
              <li>
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="text-white font-medium hover:text-yellow-300 transition-colors"
                >
                  Login
                </button>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <ul className="flex flex-col gap-4">
                <li><a href="#about" className="text-white font-medium hover:text-yellow-300 transition-colors block">About</a></li>
                <li><a href="#features" className="text-white font-medium hover:text-yellow-300 transition-colors block">Features</a></li>
                <li><a href="#contact" className="text-white font-medium hover:text-yellow-300 transition-colors block">Contact Us</a></li>
                <li>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="text-white font-medium hover:text-yellow-300 transition-colors text-left"
                  >
                    Login
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Navbar;