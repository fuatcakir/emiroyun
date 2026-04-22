import React from 'react';
import './Trophy.css';

interface TrophyProps {
  score: number;
}

const Trophy: React.FC<TrophyProps> = ({ score }) => {
  let trophyClass = 'trophy-old';
  let trophyName = 'Eski Kupa';
  let trophyColor = '#5d4037';
  let isDiamond = false;

  // Yeni Puan Eşikleri
  if (score >= 10000) {
    trophyClass = 'trophy-diamond';
    trophyName = 'Elmas Kupa';
    isDiamond = true;
  } else if (score >= 5000) {
    trophyClass = 'trophy-gold';
    trophyName = 'Altın Kupa';
    trophyColor = '#ffd700';
  } else if (score >= 2500) {
    trophyClass = 'trophy-bronze';
    trophyName = 'Bronz Kupa';
    trophyColor = '#cd7f32';
  } else if (score >= 1000) {
    trophyClass = 'trophy-wood';
    trophyName = 'Tahta Kupa';
    trophyColor = '#deb887';
  }

  return (
    <div className={`trophy-container ${trophyClass}`}>
      <div className="trophy-icon-wrapper">
        {isDiamond && (
          <svg className="wings" viewBox="0 0 100 50">
            <path d="M 0 25 Q 25 0 50 25 Q 75 0 100 25" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M 10 20 Q 25 5 40 20" fill="none" stroke="white" strokeWidth="1" />
            <path d="M 60 20 Q 75 5 90 20" fill="none" stroke="white" strokeWidth="1" />
          </svg>
        )}
        <svg className={`trophy-icon ${isDiamond ? 'diamond-gradient-icon' : ''}`} viewBox="0 0 24 24" fill={isDiamond ? 'none' : trophyColor}>
          <defs>
            <linearGradient id="diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00bfff" /> {/* Mavi */}
              <stop offset="100%" stopColor="#ff69b4" /> {/* Pembe */}
            </linearGradient>
          </defs>
          <path d="M18,2H6C4.9,2,4,2.9,4,4v2c0,2.21,1.79,4,4,4h1v1.89c0,2.16,1.4,4.01,3.42,4.72C11.66,17.46,11,18.66,11,20h2 c0-1.34-0.66-2.54-1.42-3.39C13.6,15.9,15,14.05,15,11.89V10h1c2.21,0,4-1.79,4-4V4C20,2.9,19.1,2,18,2z M6,8c-1.1,0-2-0.9-2-2V4h2 V8z M18,6c0,1.1-0.9,2-2,2h-1V4h2V6z" />
          <path d="M17,22H7v-2h10V22z" />
        </svg>
      </div>
      <div className="trophy-name">{trophyName}</div>
    </div>
  );
};

export default Trophy;
