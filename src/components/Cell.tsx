import React from 'react';
import { TETROMINOES } from '../utils/tetrominoes';
import './Cell.css';

interface CellProps {
  type: keyof typeof TETROMINOES;
}

const Cell: React.FC<CellProps> = ({ type }) => {
  const color = TETROMINOES[type].color;
  
  return (
    <div 
      className={`cell ${type === 0 ? 'cell-empty' : 'cell-filled'}`}
      style={{
        backgroundColor: `rgba(${color}, 0.8)`,
        border: type === 0 ? '1px solid rgba(255, 255, 255, 0.05)' : `4px solid rgba(${color}, 1)`,
        boxShadow: type === 0 ? 'none' : `0 0 15px rgba(${color}, 0.7), inset 0 0 10px rgba(${color}, 0.5)`
      }}
    />
  );
};

export default React.memo(Cell);
