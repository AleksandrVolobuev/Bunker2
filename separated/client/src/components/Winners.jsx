import React from 'react';

/**
 * Экран победителей.
 * @param {{ room: Object|null, selectors: Object }} props
 * @returns {JSX.Element|null}
 */
const Winners = ({ room, selectors }) => {
  if (!room || room.phase !== 'END') {
    return null;
  }

  // Подготовленный список выживших.
  const winners = selectors?.winners || [];

  return (
    <div id="winnersSection">
      <div className="winners-box">
        <h2>🎉 Выжившие в бункере 🎉</h2>
        <p className="winners-subtitle">
          Эти {winners.length} {winners.length === 1 ? 'человек' : 'человека'} смогут начать новую жизнь после катастрофы!
        </p>
        <div className="winners-list">
          {winners.map((winner) => (
            <p key={winner.id} className="winner-item">
              ✓ {winner.name} ({winner.card.profession})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Winners);
