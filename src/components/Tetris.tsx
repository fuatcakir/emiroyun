import React, { useState, useCallback } from 'react';

import { createStage, useBoard } from '../hooks/useBoard';
import { usePlayer, checkCollision } from '../hooks/usePlayer';
import { useInterval } from '../hooks/useInterval';
import { useGameStatus } from '../hooks/useGameStatus';
import { useBoss } from '../hooks/useBoss';
import { useHero } from '../hooks/useHero';
import { TETROMINOES, randomTetromino } from '../utils/tetrominoes';

import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import Boss from './Boss';
import Hero from './Hero';
import Trophy from './Trophy';

import './Tetris.css';

const Tetris: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedChar, setSelectedChar] = useState<'angel' | 'demon'>('angel');
  const [dropTime, setDropTime] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [holdPiece, setHoldPiece] = useState<any>(null);
  const [canHold, setCanHold] = useState(true);
  const [nextPiece, setNextPiece] = useState<any>(randomTetromino());
  const [showUltiModal, setShowUltiModal] = useState(false);
  const [manualDamage, setManualDamage] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('tetris-high-score')) || 0);
  const gameRef = React.useRef<HTMLDivElement>(null);

  const [player, updatePlayerPos, resetPlayer, playerRotate, setPlayer] = usePlayer();
  
  const handleReset = useCallback(() => {
    const next = nextPiece;
    setNextPiece(randomTetromino());
    resetPlayer(next);
    setCanHold(true);
  }, [nextPiece, resetPlayer]);

  const [stage, setStage, rowsCleared] = useBoard(player, handleReset);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  // En yüksek puanı güncelle
  React.useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetris-high-score', score.toString());
    }
  }, [score, highScore]);
  const [bossHp, maxBossHp, isBossDamaged, bossLevel, bossVictory] = useBoss(rowsCleared, manualDamage);
  const [heroEnergy, isHeroAttacking, _powerType, comboGauge, isFuryMode, triggerMiniPower, useSpecialAttack] = useHero(rowsCleared);

  const handleUltiChoice = (choice: boolean) => {
    if (choice) {
      setStage(prev => {
        const newStage = prev.map(row => [...row]);
        let clearedCount = 0;
        for (let y = 19; y >= 0 && clearedCount < 3; y--) {
          if (newStage[y].some(cell => cell[0] !== 0)) {
            newStage[y] = new Array(10).fill([0, 'clear']);
            clearedCount++;
          }
        }
        return newStage;
      });
      setManualDamage(50);
      useSpecialAttack();
      setTimeout(() => setManualDamage(0), 100);
    }
    setShowUltiModal(false);
    setDropTime(1000 / (level + 1) + 200);
    gameRef.current?.focus(); // Seçimden sonra odağı geri al
  };

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
      triggerMiniPower();
      setManualDamage(1);
      setTimeout(() => setManualDamage(0), 50);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setStage(createStage());
    setDropTime(1000);
    const firstPiece = randomTetromino();
    const secondPiece = randomTetromino();
    setPlayer({
      pos: { x: 5 - 2, y: 0 },
      tetromino: firstPiece.shape as any,
      collided: false,
    });
    setNextPiece(secondPiece);
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    setHoldPiece(null);
    setCanHold(true);
    setShowUltiModal(false);
    setTimeout(() => {
      gameRef.current?.focus();
    }, 100);
  };

  const hold = () => {
    if (!canHold || gameOver || showUltiModal) return;
    const currentType = Object.keys(TETROMINOES).find(k => TETROMINOES[k as keyof typeof TETROMINOES].shape === player.tetromino);
    if (holdPiece === null) {
      setHoldPiece(currentType);
      resetPlayer();
    } else {
      const heldType = holdPiece;
      setHoldPiece(currentType);
      setPlayer({ pos: { x: 3, y: 0 }, tetromino: TETROMINOES[heldType as keyof typeof TETROMINOES].shape as any, collided: false });
    }
    setCanHold(false);
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      setLevel(l => l + 1);
      setDropTime(1000 / (level + 2) + 200);
    }
    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) { setGameOver(true); setDropTime(null); return; }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const destroyActiveBlock = () => {
    if (gameOver || showUltiModal) return;
    resetPlayer();
    setManualDamage(1);
    setTimeout(() => setManualDamage(0), 50);
  };

  const move = (e: React.KeyboardEvent) => {
    if (!gameStarted || gameOver || showUltiModal) return;

    // Space, Enter ve Ok tuşlarının varsayılan tarayıcı davranışını engelle
    if ([32, 37, 38, 39, 40, 13].includes(e.keyCode)) {
      e.preventDefault();
    }

    if (e.keyCode === 37) movePlayer(-1);
    else if (e.keyCode === 39) movePlayer(1);
    else if (e.keyCode === 40) { drop(); triggerMiniPower(); }
    else if (e.keyCode === 38) { playerRotate(stage, 1); triggerMiniPower(); }
    else if (e.keyCode === 67) hold();
    else if (e.keyCode === 13) destroyActiveBlock();
    else if (e.keyCode === 32) {
      // Enerji kontrolünü kaldırıyorum ki hemen test edebilesin
      setDropTime(null);
      setShowUltiModal(true);
    }
  };

  useInterval(() => drop(), dropTime);

  return (
    <div 
      className="tetris-wrapper" 
      role="button" 
      tabIndex={0} 
      onKeyDown={move}
      ref={gameRef}
      style={{ outline: 'none' }}
    >
      {!gameStarted && (
        <div className="start-screen-overlay">
          <div className="arena-visual">
            <div className="arena-title">KUTSAL SAVAŞ</div>
            
            {/* Melek Tarafı */}
            <div 
              className={`shelter angel-shelter ${selectedChar === 'angel' ? 'selected' : ''}`}
              onClick={() => setSelectedChar('angel')}
              style={{ cursor: 'pointer' }}
            >
              {[...Array(12)].map((_, i) => <div key={i} className="shelter-block" />)}
              <div className="angel">👼</div>
            </div>

            {/* Ateş Hatları */}
            <div className="attack-line angel-attack" />
            <div className="attack-line demon-attack" />

            {/* Şeytan Tarafı */}
            <div 
              className={`shelter demon-shelter ${selectedChar === 'demon' ? 'selected' : ''}`}
              onClick={() => setSelectedChar('demon')}
              style={{ cursor: 'pointer' }}
            >
              {[...Array(12)].map((_, i) => <div key={i} className="shelter-block" />)}
              <div className="demon">👿</div>
            </div>
          </div>
          <div className="start-button-wrapper">
            <StartButton callback={startGame} />
          </div>
        </div>
      )}
      <div className="tetris">
        <aside className="left-aside">
          <Boss hp={bossHp} maxHp={maxBossHp} isDamaged={isBossDamaged} level={bossLevel} victory={bossVictory} />
          <Display text="HOLD" />
          <div className="hold-box">
            {holdPiece && TETROMINOES[holdPiece as keyof typeof TETROMINOES].shape.map((row: any[], y: number) => (
              <div key={y} className="hold-row">
                {row.map((cell: any, x: number) => (
                  <div key={x} className="hold-cell" style={{
                    backgroundColor: cell !== 0 ? `rgba(${TETROMINOES[holdPiece as keyof typeof TETROMINOES].color}, 0.8)` : 'transparent',
                    border: cell !== 0 ? `2px solid rgba(${TETROMINOES[holdPiece as keyof typeof TETROMINOES].color}, 1)` : 'none'
                  }} />
                ))}
              </div>
            ))}
          </div>
        </aside>

        <Stage stage={stage} />

        <aside>
          {gameOver ? (
            <div>
              <Display gameOver={gameOver} text="Oyun Bitti" />
              <StartButton callback={() => setGameStarted(false)} text="ANA MENÜ" />
            </div>
          ) : (
            <div>
              <Hero energy={heroEnergy} isAttacking={isHeroAttacking} level={level} comboGauge={comboGauge} isFuryMode={isFuryMode} />
              <Display text="SIRADAKİ" />
              <div className="hold-box next-box">
                {nextPiece.shape.map((row: any[], y: number) => (
                  <div key={y} className="hold-row">
                    {row.map((cell: any, x: number) => (
                      <div key={x} className="hold-cell" style={{
                        backgroundColor: cell !== 0 ? `rgba(${nextPiece.color}, 0.8)` : 'transparent',
                        border: cell !== 0 ? `2px solid rgba(${nextPiece.color}, 1)` : 'none'
                      }} />
                    ))}
                  </div>
                ))}
              </div>
              <Trophy score={highScore} />
              <Display text={`Puan: ${score}`} />
              <Display text={`Satır: ${rows}`} />
              <Display text={`Seviye: ${level}`} />
            </div>
          )}
        </aside>
      </div>

      {showUltiModal && (
        <div className="ulti-modal-overlay">
          <div className="ulti-modal">
            <h2>ULTİ Mİ YAPACAKSIN?</h2>
            <p>Enerjinin %50'si kullanılacak!</p>
            <div className="ulti-buttons">
              <button className="ulti-btn evet" onClick={() => handleUltiChoice(true)}>EVET</button>
              <button className="ulti-btn hayir" onClick={() => handleUltiChoice(false)}>HAYIR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tetris;
