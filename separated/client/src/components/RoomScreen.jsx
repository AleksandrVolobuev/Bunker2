import React from 'react';
import BunkerInfo from './BunkerInfo.jsx';
import Chat from './Chat.jsx';
import HostControls from './HostControls.jsx';
import PlayersList from './PlayersList.jsx';
import Results from './Results.jsx';
import Timer from './Timer.jsx';
import Voting from './Voting.jsx';
import Winners from './Winners.jsx';
import MyCard from './MyCard.jsx';
import useRoomSelectors from '../hooks/useRoomSelectors.js';
import useRoomViewModel from '../hooks/useRoomViewModel.js';

/**
 * Экран комнаты с игровым процессом.
 * @param {{ isActive: boolean, room: Object|null, myPlayerId: string|null, myCard: Object|null, timer: number|null, onSendMessage: Function, onVote: Function, onStartGame: Function, onToDiscussion: Function, onToVoting: Function, onEndVoting: Function, onContinueGame: Function, onRevealCard: Function }} props
 * @returns {JSX.Element}
 */
const RoomScreen = ({
  isActive,
  room,
  myPlayerId,
  myCard,
  timer,
  onSendMessage,
  onVote,
  onStartGame,
  onToDiscussion,
  onToVoting,
  onEndVoting,
  onContinueGame,
  onRevealCard
}) => {
  // Селекторы и вью-модель для упрощения UI.
  const selectors = useRoomSelectors(room, myPlayerId);
  const viewModel = useRoomViewModel(room, selectors, myCard, timer);
  return (
    <div id="roomScreen" className={`screen ${isActive ? 'active' : ''}`.trim()}>
      <div className="card">
        {/* Заголовок комнаты */}
        <div className="room-code type-title" id="displayRoomCode">{viewModel.roomCode}</div>
        <p className="room-hint type-meta">Поделитесь этим кодом с друзьями</p>

        {/* Таймер фазы */}
        <Timer seconds={viewModel.timer} />

        {/* Информация о бункере */}
        <BunkerInfo room={room} selectors={selectors} />

        {/* Индикатор текущей фазы */}
        <div id="phaseIndicator" className="phase-indicator">
          {viewModel.phaseLabel}
        </div>

        {/* Карты текущего игрока */}
        {viewModel.hasCard ? (
          <MyCard
            card={myCard}
            cardFields={room?.cardFields || []}
            canReveal={selectors.canReveal}
            onReveal={onRevealCard}
          />
        ) : (
          <div id="yourCardDiv" className="hidden"></div>
        )}

        {/* Чат */}
        <Chat
          isVisible={viewModel.showChat}
          messages={selectors.chatMessages}
          onSendMessage={onSendMessage}
        />

        {/* Список игроков */}
        <h3 className="section-title type-title">Игроки</h3>
        <PlayersList room={room} selectors={selectors} />

        {/* Голосование */}
        <Voting room={room} selectors={selectors} onVote={onVote} />

        {/* Результаты */}
        <Results room={room} selectors={selectors} />

        {/* Победители */}
        <Winners room={room} selectors={selectors} />

        {/* Управление хоста */}
        <HostControls
          room={room}
          selectors={selectors}
          onStartGame={onStartGame}
          onToDiscussion={onToDiscussion}
          onToVoting={onToVoting}
          onEndVoting={onEndVoting}
          onContinueGame={onContinueGame}
        />
      </div>
    </div>
  );
};

export default RoomScreen;
