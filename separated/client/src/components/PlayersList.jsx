import React from 'react';

/**
 * Список игроков комнаты.
 * @param {{ room: Object|null, selectors: Object }} props
 * @returns {JSX.Element}
 */
const PlayersList = ({ room, selectors }) => {
  if (!room) {
    return <div id="playersList"></div>;
  }

  const playerBadges = selectors?.playerBadges;

  return (
    <div id="playersList">
      {/* Карточки игроков */}
      {room.players.map((player) => {
        // Бейджи статуса игрока.
        const badges = playerBadges ? playerBadges(player) : [];

        return (
          <div key={player.id} className={`player-card ${!player.isAlive ? 'dead' : ''} ${player.hasVoted ? 'voted' : ''}`.trim()}>
            <div className="player-header">
              <div className="player-name">{player.name}</div>
              <div className="player-badges">
                {badges.map((label) => (
                  <span key={label} className={`badge badge-${label === 'Хост' ? 'host' : label === 'Выбыл' ? 'dead' : 'voted'}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            {/* Открытая информация игрока */}
            {player.revealed ? (
              <div className="revealed-line">
                Показал: {player.revealed.label} — {player.revealed.value}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(PlayersList);
