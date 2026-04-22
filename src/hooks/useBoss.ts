import { useState, useCallback, useEffect } from 'react';

export const useBoss = (rowsCleared: number, manualDamage: number = 0) => {
  const [bossHp, setBossHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [isDamaged, setIsDamaged] = useState(false);
  const [bossLevel, setBossLevel] = useState(1);
  const [victory, setVictory] = useState(false);

  const damageBoss = useCallback((amount: number) => {
    if (amount > 0 && !victory) {
      setBossHp((prev) => Math.max(0, prev - amount));
      setIsDamaged(true);
      setTimeout(() => setIsDamaged(false), 300);
    }
  }, [victory]);

  useEffect(() => {
    if (rowsCleared > 0) {
      damageBoss(rowsCleared * 10);
    }
  }, [rowsCleared, damageBoss]);

  useEffect(() => {
    if (manualDamage > 0) {
      damageBoss(manualDamage);
    }
  }, [manualDamage, damageBoss]);

  useEffect(() => {
    if (bossHp <= 0 && !victory) {
      setVictory(true);
      // 2 saniye sonra yeni canavara geç
      setTimeout(() => {
        const nextLevel = bossLevel + 1;
        const nextMaxHp = 100 + (nextLevel - 1) * 50; // Her seviyede +50 HP
        setMaxHp(nextMaxHp);
        setBossHp(nextMaxHp);
        setBossLevel(nextLevel);
        setVictory(false);
      }, 2000);
    }
  }, [bossHp, victory, bossLevel]);

  return [bossHp, maxHp, isDamaged, bossLevel, victory] as const;
};
