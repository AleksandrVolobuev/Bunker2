import { useMemo } from 'react';

/**
 * Селекторы и производные данные комнаты.
 * @param {Object|null} room
 * @param {string|null} myPlayerId
 * @returns {Object}
 */
const useRoomSelectors = (room, myPlayerId) => {
  return useMemo(() => {
    if (!room) {
      return {
        me: null,
        alivePlayers: [],
        alivePlayersCount: 0,
        aliveOthers: [],
        needToEliminate: null,
        currentRound: null,
        canVote: false,
        isHost: false,
        allVoted: false,
        winners: [],
        showChat: false,
        showCards: false
      };
    }

    // Базовые коллекции и вычисления.
    const players = room.players || [];
    const me = players.find((player) => player.id === myPlayerId) || null;
    const alivePlayers = players.filter((player) => player.isAlive);
    const alivePlayersCount = alivePlayers.length;
    const aliveOthers = alivePlayers.filter((player) => player.id !== myPlayerId);

    // Параметры игры.
    const capacity = room.bunkerInfo ? room.bunkerInfo.capacity : null;
    const needToEliminate = capacity !== null && capacity !== undefined
      ? alivePlayersCount - capacity
      : null;

    const totalPlayers = players.length;
    const currentRound = totalPlayers && alivePlayersCount
      ? totalPlayers - alivePlayersCount + 1
      : null;

    // UI-флаги.
    const canVote = room.phase === 'VOTING' && me && me.isAlive;
    const isHost = Boolean(me && me.isHost);
    const allVoted = room.phase === 'VOTING' && alivePlayers.every((player) => player.hasVoted);
    const winners = room.phase === 'END' ? alivePlayers : [];
    const showChat = room.phase !== 'WAITING';
    const showCards = ['REVEAL', 'DISCUSSION', 'VOTING', 'RESULTS', 'END'].includes(room.phase);
    // Бейджи статуса игрока.
    const playerBadges = (player) => {
      const badges = [];
      if (player.isHost) badges.push('Хост');
      if (!player.isAlive) badges.push('Выбыл');
      if (player.hasVoted && room.phase === 'VOTING') badges.push('Проголосовал');
      return badges;
    };
    // Подготовленные сообщения чата.
    const chatMessages = (room.messages || []).map((message) => {
      const time = new Date(message.timestamp);
      const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      return {
        ...message,
        timeStr
      };
    });
    // Подсчёты голосов для результата.
    const voteCounts = room.phase === 'RESULTS' && room.voteResult
      ? Object.entries(room.voteResult.votes).map(([id, count]) => {
        const player = players.find((p) => p.id === id);
        return {
          id,
          name: player ? player.name : 'Неизвестный',
          count,
          label: count === 1 ? 'голос' : 'голосов'
        };
      })
      : [];

    return {
      me,
      alivePlayers,
      alivePlayersCount,
      aliveOthers,
      needToEliminate,
      currentRound,
      canVote,
      isHost,
      allVoted,
      winners,
      showChat,
      showCards,
      playerBadges,
      chatMessages,
      voteCounts
    };
  }, [room, myPlayerId]);
};

export default useRoomSelectors;
