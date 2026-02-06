import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import MainScreen from './components/MainScreen.jsx';
import RoomScreen from './components/RoomScreen.jsx';
import useGameState from './hooks/useGameState.js';

const App = () => {
  const { state, actions } = useGameState();
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const introRef = useRef(null);
  const gameRef = useRef(null);
  const activeTrackRef = useRef('none');

  const handleToggleMusic = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    setMusicEnabled((prev) => !prev);
  };

  const handleFirstInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };

  useEffect(() => {
    if (introRef.current) {
      introRef.current.loop = true;
      introRef.current.volume = 0.35;
    }
    if (gameRef.current) {
      gameRef.current.loop = true;
      gameRef.current.volume = 0.35;
    }
  }, []);

  useEffect(() => {
    const intro = introRef.current;
    const game = gameRef.current;
    if (!intro || !game) {
      return;
    }

    const desiredTrack = !musicEnabled || !hasUserInteracted
      ? 'none'
      : state.screen === 'room'
        ? 'game'
        : state.screen === 'main'
          ? 'intro'
          : 'none';

    if (desiredTrack === activeTrackRef.current) {
      return;
    }

    const stopTrack = (audio) => {
      audio.pause();
      audio.currentTime = 0;
    };

    if (activeTrackRef.current === 'intro') {
      stopTrack(intro);
    }
    if (activeTrackRef.current === 'game') {
      stopTrack(game);
    }

    if (desiredTrack === 'intro') {
      intro.play().catch(() => {});
    }
    if (desiredTrack === 'game') {
      game.play().catch(() => {});
    }

    activeTrackRef.current = desiredTrack;
  }, [state.screen, musicEnabled, hasUserInteracted]);

  return (
    <div className="container" onPointerDown={handleFirstInteraction}>
      <Header musicEnabled={musicEnabled} onToggleMusic={handleToggleMusic} />
      <audio ref={introRef} src="/music/intro.mp3" preload="auto" />
      <audio ref={gameRef} src="/music/game.mp3" preload="auto" />
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
