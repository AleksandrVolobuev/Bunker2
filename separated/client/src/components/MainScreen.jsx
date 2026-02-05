import React, { useState } from 'react';

/**
 * Главный экран: создание/вход в комнату.
 * @param {{ isActive: boolean, onCreateRoom: Function, onJoinRoom: Function, errorMessage: string }} props
 * @returns {JSX.Element}
 */
const MainScreen = ({ isActive, onCreateRoom, onJoinRoom, errorMessage }) => {
  // Локальные поля ввода для формы.
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  // Обработчики действий.
  const handleCreate = () => {
    onCreateRoom(playerName);
  };

  const handleJoin = () => {
    onJoinRoom(playerName, roomCode);
  };

  return (
    <div id="mainScreen" className={`screen ${isActive ? 'active' : ''}`.trim()}>
      {/* Форма создания комнаты */}
      <div className="card">
        <div className="input-group">
          <label className="type-meta" htmlFor="playerName">Ваше имя</label>
          <input
            type="text"
            id="playerName"
            placeholder="Введите имя"
            maxLength={20}
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </div>
        <div className="btn-group">
          <button className="btn type-button" onClick={handleCreate}>Создать комнату</button>
        </div>
      </div>

      {/* Форма входа по коду */}
      <div className="card">
        <div className="input-group">
          <label className="type-meta" htmlFor="roomCode">Код комнаты</label>
          <input
            type="text"
            id="roomCode"
            placeholder="Введите код"
            maxLength={4}
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value)}
          />
        </div>
        <div className="btn-group">
          <button className="btn btn-secondary type-button" onClick={handleJoin}>Присоединиться</button>
        </div>
      </div>

      {/* Блок ошибок */}
      <div id="errorDiv">
        {errorMessage ? <div className="error-message">{errorMessage}</div> : null}
      </div>
    </div>
  );
};

export default MainScreen;
