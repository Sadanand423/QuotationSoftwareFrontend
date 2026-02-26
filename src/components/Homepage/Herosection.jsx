import React, { useEffect, useState, useMemo } from 'react';

const HeroSection = ({ onGetStarted }) => {
  const [stage, setStage] = useState('orbiting'); 
  const text = "Smart Matrix";
  const characters = text.split("");

  // Create a large pool of particles. 
  // Each particle will eventually "home" in on a specific letter.
  const particles = useMemo(() => {
    return Array.from({ length: 250 }).map((_, i) => {
      const charIndex = i % characters.length;
      const angle = Math.random() * Math.PI * 2;
      const orbitRadius = 200 + Math.random() * 100;
      
      return {
        id: i,
        charIndex,
        // Starting position in the 5-second circle
        startX: Math.cos(angle) * orbitRadius,
        startY: Math.sin(angle) * orbitRadius,
        // Random offset within the letter's area to "draw" the shape
        offsetX: (Math.random() - 0.5) * 40, 
        offsetY: (Math.random() - 0.5) * 60,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 0.8, // Creates the "slowly slowly" effect
      };
    });
  }, [characters.length]);

  useEffect(() => {
    const timer = setTimeout(() => setStage('assembling'), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-[#050816] min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center relative z-10 w-full max-w-7xl">
        
        {/* WELCOME TEXT - Fades in only after assembly starts */}
        <div className={`mb-4 transition-opacity duration-1000 ${stage === 'assembling' ? 'opacity-60' : 'opacity-0'}`}>
          <span className="text-blue-400 font-bold tracking-[0.5em] uppercase text-sm">Welcome To</span>
        </div>

        <div className="relative flex justify-center items-center flex-wrap gap-x-2 sm:gap-x-4 min-h-[150px]">
          
          {characters.map((char, charIdx) => (
            <div key={charIdx} className="relative inline-block">
              {/* THE TARGET LETTER: Becomes visible slowly as dots arrive */}
              <span 
                className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-500 transition-opacity duration-[2500ms] ${stage === 'assembling' ? 'opacity-100' : 'opacity-0'} ${char === " " ? "w-8" : ""}`}
                style={{ transitionDelay: `${charIdx * 0.1}s` }}
              >
                {char}
              </span>

              {/* THE DOTS ASSIGNED TO THIS SPECIFIC LETTER */}
              {char !== " " && particles.filter(p => p.charIndex === charIdx).map((p) => (
                <div
                  key={p.id}
                  className="absolute rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"
                  style={{
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    top: '50%',
                    left: '50%',
                    '--startX': `${p.startX}px`,
                    '--startY': `${p.startY}px`,
                    '--endX': `${p.offsetX}px`,
                    '--endY': `${p.offsetY}px`,
                    animation: stage === 'orbiting' 
                      ? `orbit-circle 5s linear infinite` 
                      : `fly-to-letter 2s cubic-bezier(0.19, 1, 0.22, 1) forwards`,
                    animationDelay: stage === 'assembling' ? `${p.delay + (charIdx * 0.1)}s` : '0s',
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* BUTTONS */}
        <div className={`mt-16 transition-all duration-1000 delay-[3s] ${stage === 'assembling' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={onGetStarted} className="px-12 py-4 bg-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] transition-all uppercase tracking-widest text-sm">
              Get Started
            </button>
            <button className="px-12 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all uppercase tracking-widest text-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Phase 1: Dots rotate in a big circle for 5s */
        @keyframes orbit-circle {
          0% { transform: rotate(0deg) translate(var(--startX), var(--startY)); }
          100% { transform: rotate(360deg) translate(var(--startX), var(--startY)); }
        }

        /* Phase 2: Dots fly "Slowly Slowly" to their letter positions */
        @keyframes fly-to-letter {
          0% { 
            transform: rotate(360deg) translate(var(--startX), var(--startY));
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% { 
            transform: translate(var(--endX), var(--endY)) scale(0.5); 
            opacity: 0;
          }
        }

        body { background-color: #f0f0f4fb; }
      `}} />
    </section>
  );
};

export default HeroSection;