import { useMemo } from 'react';
import usePhaseLabel from './usePhaseLabel.js';

/**
 * Вью-модель комнаты для UI.
 * @param {Object|null} room
 * @param {Object} selectors
 * @param {Object|null} myCard
 * @param {number|null} timer
 * @returns {{ roomId: string, roomCode: string, phaseLabel: string, showChat: boolean, hasCard: boolean, timer: number|null }}
 */
const useRoomViewModel = (room, selectors, myCard, timer) => {
  // Человекочитаемая подпись фазы.
  const phaseLabel = usePhaseLabel(room?.phase);

  return useMemo(() => {
    // Компактная модель для UI.
    return {
      roomId: room ? room.id : '',
      roomCode: room ? room.id : '',
      phaseLabel,
      showChat: selectors?.showChat ?? false,
      hasCard: Boolean(myCard),
      timer: timer ?? room?.timer ?? null
    };
  }, [room, phaseLabel, selectors, myCard, timer]);
};

export default useRoomViewModel;
