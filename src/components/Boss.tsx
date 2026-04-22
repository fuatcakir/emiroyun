import React from 'react';
import './Boss.css';

interface BossProps {
  hp: number;
  maxHp: number;
  isDamaged: boolean;
  level: number;
  victory: boolean;
}

const Boss: React.FC<BossProps> = ({ hp, maxHp, isDamaged, level, victory }) => {
  const hpPercentage = (hp / maxHp) * 100;
  const types = ['devil', 'tiger', 'robot', 'dragon', 'alien'];
  const bossType = types[(level - 1) % types.length];

  return (
    <div className={`boss-container ${isDamaged ? 'boss-damaged' : ''} ${victory ? 'boss-victory' : ''}`}>
      {victory && <div className="victory-text">YENİLDİ!</div>}
      
      {!victory && (
        <>
          <div className="boss-info">
            <span className="boss-name">{bossType.toUpperCase()} LVL {level}</span>
            <div className="hp-bar-container">
              <div className="hp-bar" style={{ width: `${hpPercentage}%` }}></div>
            </div>
          </div>
          
          <div className={`monster boss-${bossType}`}>
            {/* Ortak Göz Yapısı */}
            <div className="monster-eyes">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>

            {bossType === 'devil' && (
              <div className="devil-features">
                <div className="horns-large"></div>
                <div className="devil-mouth"></div>
              </div>
            )}
            {bossType === 'tiger' && (
              <div className="tiger-features">
                <div className="tiger-ears"></div>
                <div className="stripes"></div>
              </div>
            )}
            {bossType === 'robot' && (
              <div className="robot-features">
                <div className="antenna"></div>
                <div className="eye-visor"></div>
              </div>
            )}
            {bossType === 'dragon' && (
              <div className="dragon-features">
                <div className="dragon-scales"></div>
              </div>
            )}
            {bossType === 'alien' && (
              <div className="alien-features">
                <div className="tentacles"></div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Boss;
