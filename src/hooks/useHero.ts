import { useState, useCallback, useEffect } from 'react';

export const useHero = (rowsCleared: number) => {
  const [energy, setEnergy] = useState(100); // Test için %100 başlatıyorum
  const [isAttacking, setIsAttacking] = useState(false);
  const [powerType, setPowerType] = useState<string | null>(null);
  const [comboGauge, setComboGauge] = useState(0);
  const [isFuryMode, setIsFuryMode] = useState(false);

  useEffect(() => {
    if (rowsCleared > 0) {
      setEnergy(prev => Math.min(100, prev + rowsCleared * 20)); // Daha hızlı enerji
    }
  }, [rowsCleared]);

  useEffect(() => {
    const timer = setInterval(() => {
      setComboGauge(prev => (prev > 0 ? prev - 3 : 0));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (comboGauge >= 100 && !isFuryMode) {
      setIsFuryMode(true);
      setPowerType('fury');
      setTimeout(() => {
        setIsFuryMode(false);
        setComboGauge(0);
        setPowerType(null);
      }, 3000);
    }
  }, [comboGauge, isFuryMode]);

  const triggerMiniPower = useCallback(() => {
    setComboGauge(prev => Math.min(100, prev + 10));
  }, []);

  const useSpecialAttack = useCallback(() => {
    setEnergy(prev => Math.max(0, prev - 50));
    setIsAttacking(true);
    setTimeout(() => setIsAttacking(false), 1000);
  }, []);

  return [energy, isAttacking, powerType, comboGauge, isFuryMode, triggerMiniPower, useSpecialAttack] as const;
};
