import { useState, useCallback } from 'react';
import { TETROMINOES, randomTetromino } from '../utils/tetrominoes';

export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const usePlayer = () => {
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOES[0].shape,
    collided: false,
  });

  const rotate = (matrix: any[][], dir: number) => {
    // Transpose
    const rotated = matrix.map((_, index) => matrix.map((col) => col[index]));
    // Reverse rows to get 90 degree rotation
    if (dir > 0) return rotated.map((row) => row.reverse());
    return rotated.reverse();
  };

  const playerRotate = (stage: any[][], dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = pos;
        return;
      }
    }
    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: prev.pos.x + x, y: prev.pos.y + y },
      collided,
    }));
  };

  const resetPlayer = useCallback((newTetromino?: any) => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: (newTetromino || randomTetromino()).shape as any,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate, setPlayer] as const;
};

export const checkCollision = (player: any, stage: any[][], { x: moveX, y: moveY }: { x: number; y: number }) => {
  for (let y = 0; y < player.tetromino.length; y += 1) {
    for (let x = 0; x < player.tetromino[y].length; x += 1) {
      if (player.tetromino[y][x] !== 0) {
        if (
          !stage[y + player.pos.y + moveY] ||
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
