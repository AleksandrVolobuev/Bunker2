import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

/**
 * Центральное состояние игры и действия, связанные с сокетами.
 * @returns {{ state: Object, actions: Object }}
 */
const useGameState = () => {
  // Сокет и служебные ссылки.
  const socketRef = useRef(null);
  const myPlayerIdRef = useRef(null);

  // Состояния UI и игры.
  const [screen, setScreen] = useState('main');
  const [room, setRoom] = useState(null);
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [myCard, setMyCard] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(null);

  // Показ ошибки с автоочисткой.
  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  // Обновление ID игрока с сохранением в ref.
  const updateMyPlayerId = (id) => {
    myPlayerIdRef.current = id;
    setMyPlayerId(id);
  };

  // Создать комнату.
  const createRoom = (name) => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }
    const trimmedName = (name || '').trim();
    if (!trimmedName) {
      showError('Введите имя');
      return;
    }
    socket.emit('createRoom', { name: trimmedName });
  };

  // Войти в комнату.
  const joinRoom = (name, roomCode) => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    const trimmedName = (name || '').trim();
    const trimmedRoom = (roomCode || '').trim().toUpperCase();

    if (!trimmedName) {
      showError('Введите имя');
      return;
    }
    if (!trimmedRoom) {
      showError('Введите код комнаты');
      return;
    }

    socket.emit('joinRoom', { roomId: trimmedRoom, name: trimmedName });
  };

  // Управляющие действия хоста.
  const startGame = () => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }
    socket.emit('startGame', { roomId: room.id });
  };

  const toDiscussion = () => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }
    socket.emit('toDiscussion', { roomId: room.id });
  };

  const toVoting = () => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }
    socket.emit('toVoting', { roomId: room.id });
  };

  // Голосование и завершение раунда.
  const vote = (targetId) => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }
    socket.emit('vote', { roomId: room.id, targetId });
  };

  const endVoting = () => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }
    socket.emit('endVoting', { roomId: room.id });
  };

  const continueGame = () => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }
    socket.emit('continueGame', { roomId: room.id });
  };

  // Раскрыть карту (одно поле) в фазе обсуждения.
  const revealCard = (field) => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }

    socket.emit('revealCard', {
      roomId: room.id,
      field
    });
  };

  // Отправка сообщения в чат.
  const sendMessage = (message) => {
    const socket = socketRef.current;
    if (!socket || !room) {
      return;
    }

    const trimmed = (message || '').trim();
    if (!trimmed) {
      return;
    }

    socket.emit('sendMessage', {
      roomId: room.id,
      message: trimmed
    });
  };

  // Инициализация сокетов и подписок.
  useEffect(() => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      extraHeaders: {
        'ngrok-skip-browser-warning': '1'
      }
    });
    socketRef.current = socket;

    socket.on('roomJoined', (nextRoom) => {
      setRoom(nextRoom);
      setScreen('room');

      if (!myPlayerIdRef.current) {
        const me = nextRoom.players.find((player) => player.socketId === socket.id);
        if (me) {
          updateMyPlayerId(me.id);
          console.log('✅ Player ID установлен:', me.id);
        } else {
          console.log('⚠️ Не могу найти игрока с socketId:', socket.id);
          console.log('Доступные игроки:', nextRoom.players.map((player) => ({ name: player.name, socketId: player.socketId })));
        }
      }

      if (nextRoom.timer !== null && nextRoom.timer !== undefined) {
        setTimer(nextRoom.timer);
      }
    });

    socket.on('roomUpdate', (nextRoom) => {
      setRoom(nextRoom);
      if (screen !== 'room') {
        setScreen('room');
      }

      if (!myPlayerIdRef.current) {
        const me = nextRoom.players.find((player) => player.socketId === socket.id);
        if (me) {
          updateMyPlayerId(me.id);
          console.log('✅ Player ID установлен через roomUpdate:', me.id);
        }
      }

      if (nextRoom.timer !== null && nextRoom.timer !== undefined) {
        setTimer(nextRoom.timer);
      }
    });

    socket.on('yourCard', (card) => {
      setMyCard(card || null);
    });

    socket.on('error', (message) => {
      showError(message);
    });

    socket.on('newMessage', (message) => {
      setRoom((prevRoom) => {
        if (!prevRoom) {
          return prevRoom;
        }
        const existing = prevRoom.messages || [];
        return {
          ...prevRoom,
          messages: [...existing, message]
        };
      });
    });

    socket.on('timerUpdate', ({ timer: nextTimer }) => {
      setTimer(nextTimer);
      if (nextTimer <= 10 && nextTimer > 0) {
        console.log('⏰ Осталось', nextTimer, 'секунд!');
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  // Экспортируем состояние и действия для UI.
  return {
    state: {
      screen,
      room,
      myPlayerId,
      myCard,
      errorMessage,
      timer
    },
    actions: {
      createRoom,
      joinRoom,
      startGame,
      toDiscussion,
      toVoting,
      vote,
      endVoting,
      continueGame,
      sendMessage,
      revealCard
    }
  };
};

export default useGameState;
