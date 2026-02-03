import { useMemo } from 'react';

const PHASE_LABELS = {
  WAITING: '⏳ Ожидание игроков',
  REVEAL: '🎴 Раздача карт',
  DISCUSSION: '💬 Обсуждение',
  VOTING: '🗳️ Голосование',
  RESULTS: '📊 Результаты голосования',
  END: '🏆 Игра окончена'
};

/**
 * Преобразует код фазы в человекочитаемую подпись.
 * @param {string|null|undefined} phase
 * @returns {string}
 */
const usePhaseLabel = (phase) => {
  // Мем на фазу для стабильного рендера.
  return useMemo(() => {
    if (!phase) {
      return '';
    }
    return PHASE_LABELS[phase] || phase;
  }, [phase]);
};

export default usePhaseLabel;
