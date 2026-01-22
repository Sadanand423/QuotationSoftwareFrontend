import React, { useEffect, useState } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animation on page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center justify-center px-4">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.2}px)` }}
        ></div>
        <div 
          className="absolute bottom-10 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.4}px)` }}
        ></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/30 rotate-45"
          style={{ transform: `translateY(${scrollY * 0.1}px) rotate(45deg)` }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-6 h-6 border-2 border-purple-500/30 rounded-full"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-3/4 w-3 h-3 bg-indigo-500/40 rounded-full"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
      </div>
      
      {/* Centered Content with Pop-up Animation */}
      <div className="text-center relative z-10 max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight mb-8">
            <span className="block mb-2 sm:mb-4">Welcome To</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Smart Matrix
            </span>
          </h1>
          
          {/* Buttons with delayed animation */}
          <div className={`transition-all duration-1000 delay-500 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8 sm:mt-12">
              <button className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                <span className="flex items-center justify-center gap-2">
                  Get Started
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;