import React from 'react';

/**
 * Экран результатов голосования.
 * @param {{ room: Object|null, selectors: Object }} props
 * @returns {JSX.Element|null}
 */
const Results = ({ room, selectors }) => {
  if (!room || room.phase !== 'RESULTS' || !room.voteResult) {
    return null;
  }

  // Подготовленные данные голосов.
  const voteCounts = selectors?.voteCounts || [];

  return (
    <div id="resultsSection">
      <div className="results-box">
        <h2>Исключён из бункера</h2>
        <div className="eliminated-name">{room.voteResult.eliminatedName}</div>
        <div className="vote-counts">
          <h3 className="results-title">Результаты голосования:</h3>
          {voteCounts.map((entry) => (
            <p key={entry.id} className="vote-count-line">
              <strong>{entry.name}</strong>: {entry.count} {entry.label}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Results);
