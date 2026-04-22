import React from 'react';
import Cell from './Cell';
import './Stage.css';

interface StageProps {
  stage: any[][];
}

const Stage: React.FC<StageProps> = ({ stage }) => (
  <div className="stage">
    {stage.map((row, y) => (
      <div key={y} className={`row ${row.every(cell => cell[0] !== 0) ? 'row-clearing' : ''}`}>
        {row.map((cell, x) => <Cell key={x} type={cell[0]} />)}
      </div>
    ))}
  </div>
);

export default Stage;
