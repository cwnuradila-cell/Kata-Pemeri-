import React from 'react';
import { soundManager } from '../utils/soundEffects';

interface GoogleDoodleClassroomProps {
  children?: React.ReactNode;
}

export const GoogleDoodleClassroom: React.FC<GoogleDoodleClassroomProps> = ({ children }) => {
  const triggerDoodleInteraction = (type: string) => {
    soundManager.playPop();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fbf9f4] overflow-hidden">
      {/* Google Doodle Colorful Classroom Bunting / Pennants across top */}
      <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none flex justify-around items-start z-10 opacity-80">
        {[
          '#4285F4', '#EA4335', '#FBBC05', '#34A853',
          '#4285F4', '#EA4335', '#FBBC05', '#34A853',
          '#4285F4', '#EA4335', '#FBBC05', '#34A853'
        ].map((color, index) => (
          <div
            key={index}
            className="w-8 h-9 transition-transform origin-top animate-doodle-slow"
            style={{
              backgroundColor: color,
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              animationDelay: `${index * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Animated Doodle Assets */}
      {/* 1. Flying Paper Airplane (Kapal Terbang Kertas) */}
      <div
        onClick={() => triggerDoodleInteraction('airplane')}
        className="absolute top-16 left-6 md:left-20 cursor-pointer transition hover:scale-125 z-0 animate-doodle-slow"
        title="Klik kapal terbang kertas!"
      >
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 50L85 15L50 85L42 55L10 50Z"
            fill="#ffffff"
            stroke="#4285F4"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M85 15L42 55" stroke="#EA4335" strokeWidth="3" strokeDasharray="3 3" />
          <path
            d="M6 65C15 62 25 72 35 60"
            stroke="#FBBC05"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      {/* 2. Floating Doodle Pencil (Pensel Berwarna) */}
      <div
        onClick={() => triggerDoodleInteraction('pencil')}
        className="absolute top-28 right-8 md:right-32 cursor-pointer transition hover:rotate-12 hover:scale-110 z-0 animate-doodle-fast"
        title="Pensel Pintar"
      >
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
          <g transform="rotate(45 50 50)">
            <rect x="35" y="15" width="30" height="60" rx="3" fill="#FBBC05" stroke="#333" strokeWidth="3.5" />
            <polygon points="35,75 65,75 50,95" fill="#fde68a" stroke="#333" strokeWidth="3.5" />
            <polygon points="45,88 55,88 50,95" fill="#333" />
            <rect x="35" y="10" width="30" height="12" rx="3" fill="#EA4335" stroke="#333" strokeWidth="3" />
            <rect x="35" y="22" width="30" height="4" fill="#9ca3af" />
          </g>
        </svg>
      </div>

      {/* 3. Floating Doodle Ruler (Pembaris Sekolah) */}
      <div className="hidden lg:block absolute bottom-32 left-10 pointer-events-none opacity-60 animate-doodle-slow">
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
          <rect
            x="15"
            y="35"
            width="75"
            height="26"
            rx="4"
            fill="#34A853"
            stroke="#1e293b"
            strokeWidth="3"
            transform="rotate(-20 50 50)"
          />
          <line x1="28" y1="40" x2="28" y2="48" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="38" y1="38" x2="38" y2="46" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="48" y1="36" x2="48" y2="48" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="58" y1="34" x2="58" y2="45" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="68" y1="32" x2="68" y2="48" stroke="#ffffff" strokeWidth="2.5" />
        </svg>
      </div>

      {/* 4. Alphabet Blocks (A, B, C) */}
      <div className="hidden sm:block absolute top-72 left-8 pointer-events-none opacity-70 animate-float-gentle">
        <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-fun font-bold flex items-center justify-center text-xl shadow-md border-2 border-slate-900 rotate-[-12deg]">
          A
        </div>
        <div className="w-9 h-9 rounded-xl bg-red-500 text-white font-fun font-bold flex items-center justify-center text-lg shadow-md border-2 border-slate-900 rotate-[14deg] -mt-2 ml-5">
          B
        </div>
      </div>

      {/* 5. Google Doodle Star Sparkles */}
      <div className="absolute top-44 right-1/4 pointer-events-none opacity-70 animate-pulse">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#FBBC05">
          <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
        </svg>
      </div>

      <div className="absolute bottom-28 right-24 pointer-events-none opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#34A853">
          <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
        </svg>
      </div>

      {/* Doodle notebook grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Main Classroom App Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
