import React from 'react';

/**
 * Блок голосования.
 * @param {{ room: Object|null, selectors: Object, onVote: Function }} props
 * @returns {JSX.Element|null}
 */
const Voting = ({ room, selectors, onVote }) => {
  if (!room || room.phase !== 'VOTING') {
    return null;
  }

  // Доступ к голосованию и список целей.
  const canVote = selectors?.canVote;
  const me = selectors?.me;
  const aliveOthers = selectors?.aliveOthers || [];

  if (!canVote) {
    return (
      <div id="votingSection">
        <p className="vote-disabled-message">Вы не можете голосовать</p>
      </div>
    );
  }

  return (
    <div id="votingSection">
      <h3 className="voting-title type-title">Голосование за исключение</h3>
      <div className="vote-buttons">
        {aliveOthers.map((player) => (
          <button
            key={player.id}
            className="vote-btn type-button"
            onClick={() => onVote(player.id)}
            disabled={me.hasVoted}
          >
            {player.name}
          </button>
        ))}
      </div>
      {me && me.hasVoted ? <p className="vote-confirmation">✓ Вы проголосовали</p> : null}
    </div>
  );
};

export default Voting;
