import React from 'react';
import './StartButton.css';

interface StartButtonProps {
  callback: () => void;
  text?: string;
}

const StartButton: React.FC<StartButtonProps> = ({ callback, text = "START GAME" }) => (
  <button className="start-button" onClick={callback}>
    {text}
  </button>
);

export default StartButton;
