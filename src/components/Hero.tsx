import React from 'react';
import './Hero.css';

interface HeroProps {
  energy: number;
  isAttacking: boolean;
  level: number;
  comboGauge: number;
  isFuryMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ energy, isAttacking, level, comboGauge, isFuryMode }) => {
  const heroTypes = ['angel', 'samurai', 'cyber-knight'];
  const typeIndex = Math.floor((level || 1 - 1) / 2) % heroTypes.length;
  const heroType = heroTypes[typeIndex] || 'angel';

  return (
    <div className={`hero-container ${isAttacking ? 'hero-attack' : ''} ${isFuryMode ? 'fury-mode' : ''}`}>
      <div className="hero-info">
        <span className="hero-name">{(heroType || 'angel').toUpperCase()}</span>
        <div className="energy-bar-container">
          <div className="energy-bar" style={{ width: `${energy}%` }}></div>
        </div>
        
        {/* Kombo Barı */}
        <div className="combo-container">
          <div className="combo-bar" style={{ width: `${comboGauge}%` }}></div>
          <span className="combo-text">KOMBO</span>
        </div>
      </div>
      
      <div className={`hero-body hero-${heroType}`}>
        {isFuryMode && <div className="fury-flames"></div>}
        <div className="hero-eyes">
          <div className="h-eye left-eye"></div>
          <div className="h-eye right-eye"></div>
        </div>

        {heroType === 'angel' && (
          <div className="angel-features">
            <div className="halo"></div>
            <div className="wings-container">
              <div className="wing left-wing"></div>
              <div className="wing right-wing"></div>
            </div>
            <div className="main-body"></div>
          </div>
        )}
        {/* ... diğer tipler aynı kalacak ... */}
        {heroType === 'samurai' && (
          <div className="samurai-features">
            <div className="katana"></div>
            <div className="samurai-mask"></div>
          </div>
        )}
        {heroType === 'cyber-knight' && (
          <div className="cyber-features">
            <div className="neon-sword"></div>
            <div className="cyber-helmet"></div>
          </div>
        )}
      </div>
      
      {isFuryMode && <div className="fury-text">ÖFKE MODU!</div>}
    </div>
  );
};

export default Hero;
