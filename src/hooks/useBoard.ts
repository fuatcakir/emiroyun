import { useState, useEffect } from 'react';
import { STAGE_WIDTH, STAGE_HEIGHT } from './usePlayer';

export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );

export const useBoard = (player: any, resetPlayer: (newTet?: any) => void) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage: any[][]) =>
      newStage.reduce((acc, row) => {
        if (row.every((cell) => cell[0] !== 0)) {
          setRowsCleared((prev) => prev + 1);
          // Sırayı geçici olarak 'clearing' olarak işaretle (opsiyonel görsel kontrol için)
          acc.unshift(new Array(newStage[0].length).fill([0, 'clear']));
          return acc;
        }
        acc.push(row);
        return acc;
      }, [] as any[][]);

    const updateStage = (prevStage: any[][]) => {
      // Flush stage
      const newStage = prevStage.map((row) =>
        row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      );

      // Draw tetromino
      player.tetromino.forEach((row: any[], y: number) => {
        row.forEach((value: any, x: number) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });

      // Check for collision
      if (player.collided) {
        resetPlayer();
        return sweepRows(newStage);
      }

      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared] as const;
};
