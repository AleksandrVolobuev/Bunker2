import React from 'react';
import Header from './components/Header.jsx';
import MainScreen from './components/MainScreen.jsx';
import RoomScreen from './components/RoomScreen.jsx';
import useGameState from './hooks/useGameState.js';

const App = () => {
  const { state, actions } = useGameState();

  return (
    <div className="container">
      <Header />
      <MainScreen
        isActive={state.screen === 'main'}
        onCreateRoom={actions.createRoom}
        onJoinRoom={actions.joinRoom}
        errorMessage={state.errorMessage}
      />
      <RoomScreen
        isActive={state.screen === 'room'}
        room={state.room}
        myPlayerId={state.myPlayerId}
        myCard={state.myCard}
        timer={state.timer}
        onSendMessage={actions.sendMessage}
        onVote={actions.vote}
        onStartGame={actions.startGame}
        onToDiscussion={actions.toDiscussion}
        onToVoting={actions.toVoting}
        onEndVoting={actions.endVoting}
        onContinueGame={actions.continueGame}
        onRevealCard={actions.revealCard}
      />
    </div>
  );
};

export default App;
