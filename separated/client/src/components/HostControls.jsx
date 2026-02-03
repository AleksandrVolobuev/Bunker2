import React from 'react';

/**
 * Панель управления хоста.
 * @param {{ room: Object|null, selectors: Object, onStartGame: Function, onToDiscussion: Function, onToVoting: Function, onEndVoting: Function, onContinueGame: Function }} props
 * @returns {JSX.Element}
 */
const HostControls = ({ room, selectors, onStartGame, onToDiscussion, onToVoting, onEndVoting, onContinueGame }) => {
  if (!room) {
    return <div className="btn-group host-controls" id="hostControls"></div>;
  }

  // Данные текущего игрока и состояния.
  const me = selectors?.me;
  const isHost = selectors?.isHost;
  const allVoted = selectors?.allVoted;

  if (!me) {
    return (
      <div className="btn-group host-controls" id="hostControls">
        <p className="host-error">Ошибка: игрок не найден. Перезагрузите страницу.</p>
      </div>
    );
  }

  if (!isHost) {
    return (
      <div className="btn-group host-controls" id="hostControls">
        <p className="host-wait">Ожидаем, пока хост начнёт игру...</p>
      </div>
    );
  }

  // Набор доступных кнопок зависит от фазы.
  let content = null;

  if (room.phase === 'WAITING') {
    const disabled = room.players.length < 2;
    content = (
      <button className="btn" onClick={onStartGame} disabled={disabled}>
        Начать игру ({room.players.length} {room.players.length === 1 ? 'игрок' : 'игрока'})
      </button>
    );
  } else if (room.phase === 'REVEAL') {
    content = (
      <button className="btn btn-secondary" onClick={onToDiscussion}>Начать обсуждение</button>
    );
  } else if (room.phase === 'DISCUSSION') {
    content = (
      <button className="btn" onClick={onToVoting}>Начать голосование</button>
    );
  } else if (room.phase === 'VOTING') {
    content = (
      <button className="btn" onClick={onEndVoting} disabled={!allVoted}>
        Завершить голосование {allVoted ? '' : '(ждём всех)'}
      </button>
    );
  } else if (room.phase === 'RESULTS') {
    content = (
      <button className="btn btn-secondary" onClick={onContinueGame}>Продолжить</button>
    );
  }

  return (
    <div className="btn-group host-controls" id="hostControls">
      {content}
    </div>
  );
};

export default React.memo(HostControls);
