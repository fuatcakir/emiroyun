import React from 'react';
import './Display.css';

interface DisplayProps {
  gameOver?: boolean;
  text: string;
}

const Display: React.FC<DisplayProps> = ({ gameOver, text }) => (
  <div className={`display ${gameOver ? 'game-over' : ''}`}>
    {text}
  </div>
);

export default Display;
