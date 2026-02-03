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

  const showCards = selectors?.showCards;
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
            {/* Инфо о персонаже, если карты открыты */}
            {showCards && player.card ? (
              <div className="character-info">
                <div className="character-field">
                  <label>Профессия</label>
                  <value>{player.card.profession}</value>
                </div>
                <div className="character-field">
                  <label>Здоровье</label>
                  <value>{player.card.health}</value>
                </div>
                <div className="character-field">
                  <label>Хобби</label>
                  <value>{player.card.hobby}</value>
                </div>
                <div className="character-field">
                  <label>Фобия</label>
                  <value>{player.card.phobia}</value>
                </div>
                <div className="character-field">
                  <label>Характер</label>
                  <value>{player.card.trait}</value>
                </div>
                <div className="character-field">
                  <label>Багаж</label>
                  <value>{player.card.baggage}</value>
                </div>
                <div className="character-field">
                  <label>Факт</label>
                  <value>{player.card.fact}</value>
                </div>
                <div className="character-field">
                  <label>Возраст</label>
                  <value>{player.card.age} лет</value>
                </div>
                <div className="character-field">
                  <label>Пол</label>
                  <value>{player.card.sex}</value>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(PlayersList);
