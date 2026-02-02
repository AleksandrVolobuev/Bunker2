const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// 🌐 CORS для работы с отдельным клиентом
app.use(cors({
  origin: "*", // В продакшене укажите конкретные домены
  methods: ["GET", "POST"]
}));

const io = new Server(server, {
  cors: {
    origin: "*", // В продакшене укажите конкретные домены
    methods: ["GET", "POST"]
  }
});

// Убираем статику - клиент теперь отдельно
// app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

/* -------- Фазы -------- */
const PHASES = {
  WAITING: "WAITING",
  REVEAL: "REVEAL",
  DISCUSSION: "DISCUSSION",
  VOTING: "VOTING",
  RESULTS: "RESULTS",
  END: "END"
};

/* -------- Таймеры для каждой фазы (в секундах) -------- */
const PHASE_TIMERS = {
  REVEAL: 60,      // 1 минута на изучение карт
  DISCUSSION: 180, // 3 минуты на обсуждение
  VOTING: 60       // 1 минута на голосование
};

/* -------- Расширенные карты -------- */
const PROFESSIONS = [
  "Врач", "Инженер", "Учитель", "Повар", "Программист",
  "Фермер", "Механик", "Биолог", "Психолог", "Строитель",
  "Музыкант", "Художник", "Юрист", "Спасатель", "Электрик"
];

const HEALTH = [
  "Здоров", "Астма", "Диабет", "Бессонница", "Аллергия на пыльцу",
  "Близорукость", "Хромота", "Паническая атака", "Мигрень", "Гипертония"
];

const HOBBIES = [
  "Чтение", "Спорт", "Готовка", "Садоводство", "Рисование",
  "Музыка", "Фотография", "Путешествия", "Игры", "Рукоделие"
];

const PHOBIAS = [
  "Нет фобий", "Боязнь высоты", "Боязнь темноты", "Клаустрофобия",
  "Боязнь пауков", "Социофобия", "Боязнь воды", "Агорафобия"
];

const TRAITS = [
  "Добрый", "Эгоистичный", "Храбрый", "Трусливый", "Умный",
  "Хитрый", "Честный", "Лживый", "Терпеливый", "Импульсивный"
];

const BAGGAGE = [
  "Рюкзак с едой", "Аптечка", "Инструменты", "Книги",
  "Семена растений", "Оружие", "Радио", "Генератор",
  "Фонарик", "Спальный мешок", "Ничего"
];

const FACTS = [
  "Знает выживание в дикой природе", "Умеет оказывать первую помощь",
  "Владеет боевыми искусствами", "Говорит на 3 языках",
  "Умеет чинить технику", "Хороший повар", "Опытный охотник",
  "Знает ботанику", "Умеет строить укрытия", "Не имеет особых навыков"
];

/* -------- Комнаты -------- */
const rooms = {};

/* -------- Вспомогательные функции -------- */
function createPlayer(name, socketId, isHost) {
  return {
    id: randomUUID(),
    name,
    socketId,
    isHost,
    isAlive: true,
    card: null,
    hasVoted: false
  };
}

function generateCard() {
  return {
    profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
    health: HEALTH[Math.floor(Math.random() * HEALTH.length)],
    hobby: HOBBIES[Math.floor(Math.random() * HOBBIES.length)],
    phobia: PHOBIAS[Math.floor(Math.random() * PHOBIAS.length)],
    trait: TRAITS[Math.floor(Math.random() * TRAITS.length)],
    baggage: BAGGAGE[Math.floor(Math.random() * BAGGAGE.length)],
    fact: FACTS[Math.floor(Math.random() * FACTS.length)],
    age: Math.floor(Math.random() * 50) + 18,
    sex: Math.random() > 0.5 ? "Мужчина" : "Женщина"
  };
}

function dealCards(room) {
  room.players.forEach(player => {
    player.card = generateCard();
    io.to(player.socketId).emit("yourCard", player.card);
  });
}

function tallyVotes(room) {
  const counts = {};
  Object.values(room.votes).forEach(targetId => {
    counts[targetId] = (counts[targetId] || 0) + 1;
  });
  
  if (Object.keys(counts).length === 0) return null;
  
  const max = Math.max(...Object.values(counts));
  const losers = Object.keys(counts).filter(id => counts[id] === max);
  
  return losers[Math.floor(Math.random() * losers.length)];
}

function getPublicRoom(room) {
  return {
    id: room.id,
    phase: room.phase,
    bunkerInfo: room.bunkerInfo,
    catastrophe: room.catastrophe,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      socketId: p.socketId, // 🔥 ДОБАВЛЯЕМ socketId
      isHost: p.isHost,
      isAlive: p.isAlive,
      hasVoted: p.hasVoted,
      card: room.phase === PHASES.REVEAL || room.phase === PHASES.DISCUSSION || 
            room.phase === PHASES.VOTING || room.phase === PHASES.RESULTS || 
            room.phase === PHASES.END ? p.card : null
    })),
    votes: room.votes,
    voteResult: room.voteResult,
    messages: room.messages, // 💬 Чат
    timer: room.timer // ⏱️ Таймер
  };
}

/* -------- Функции таймера -------- */
function startTimer(room, duration) {
  // Очищаем предыдущий таймер если есть
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
  }
  
  room.timer = duration;
  
  room.timerInterval = setInterval(() => {
    room.timer--;
    
    // Отправляем обновление каждую секунду
    io.to(room.id).emit("timerUpdate", { timer: room.timer });
    
    if (room.timer <= 0) {
      clearInterval(room.timerInterval);
      room.timerInterval = null;
      
      // Автоматический переход к следующей фазе
      handleTimerEnd(room);
    }
  }, 1000);
}

function stopTimer(room) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
  room.timer = null;
}

function handleTimerEnd(room) {
  console.log(`⏰ Таймер закончился для комнаты ${room.id}, фаза: ${room.phase}`);
  
  if (room.phase === PHASES.REVEAL) {
    // Автоматический переход к обсуждению
    room.phase = PHASES.DISCUSSION;
    startTimer(room, PHASE_TIMERS.DISCUSSION);
    io.to(room.id).emit("roomUpdate", getPublicRoom(room));
    
  } else if (room.phase === PHASES.DISCUSSION) {
    // Автоматический переход к голосованию
    room.phase = PHASES.VOTING;
    room.votes = {};
    room.players.forEach(p => p.hasVoted = false);
    startTimer(room, PHASE_TIMERS.VOTING);
    io.to(room.id).emit("roomUpdate", getPublicRoom(room));
    
  } else if (room.phase === PHASES.VOTING) {
    // Автоматическое завершение голосования
    const loserId = tallyVotes(room);
    if (loserId) {
      const loser = room.players.find(p => p.id === loserId);
      if (loser) {
        loser.isAlive = false;
        
        const voteCounts = {};
        Object.values(room.votes).forEach(targetId => {
          voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
        });
        
        room.voteResult = {
          eliminatedId: loserId,
          eliminatedName: loser.name,
          votes: voteCounts
        };
      }
    }
    
    room.phase = PHASES.RESULTS;
    stopTimer(room);
    io.to(room.id).emit("roomUpdate", getPublicRoom(room));
  }
}

/* -------- Socket.IO -------- */
io.on("connection", socket => {
  console.log("Connected:", socket.id);

  socket.on("createRoom", ({ name }) => {
    const roomId = Math.random().toString(36).slice(2, 6).toUpperCase();
    const player = createPlayer(name, socket.id, true);

    console.log('📝 CREATE ROOM:', {
      roomId,
      playerName: name,
      playerId: player.id,
      socketId: socket.id
    });

    // 🔥 Вместимость бункера = 50-70% от количества игроков (минимум 2)
    const calculateBunkerCapacity = (playerCount) => {
      if (playerCount <= 3) return 1; // Для 2-3 игроков → 1 место
      if (playerCount <= 5) return 2; // Для 4-5 игроков → 2 места
      return Math.max(2, Math.floor(playerCount * 0.6)); // Для 6+ → 60%
    };

    rooms[roomId] = {
      id: roomId,
      phase: PHASES.WAITING,
      players: [player],
      votes: {},
      voteResult: null,
      messages: [], // 💬 Чат
      timer: null,  // ⏱️ Таймер
      timerInterval: null, // Интервал для таймера
      bunkerInfo: {
        capacity: 2, // Временное значение, пересчитается при старте
        duration: Math.floor(Math.random() * 6) + 5, // 5-10 лет
        supplies: ["Еда на 2 года", "Вода", "Электричество", "Медикаменты"]
      },
      catastrophe: [
        "Ядерная война",
        "Пандемия зомби",
        "Астероид",
        "Климатическая катастрофа",
        "Извержение супервулкана"
      ][Math.floor(Math.random() * 5)]
    };

    socket.join(roomId);
    const publicRoom = getPublicRoom(rooms[roomId]);
    console.log('📤 Отправляю roomJoined:', {
      players: publicRoom.players.map(p => ({name: p.name, id: p.id, socketId: 'hidden'}))
    });
    socket.emit("roomJoined", publicRoom);
  });

  socket.on("joinRoom", ({ roomId, name }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit("error", "Комната не найдена");
      return;
    }

    if (room.phase !== PHASES.WAITING) {
      socket.emit("error", "Игра уже началась");
      return;
    }

    if (room.players.some(p => p.socketId === socket.id)) {
      socket.emit("roomJoined", getPublicRoom(room));
      return;
    }

    const player = createPlayer(name, socket.id, false);
    room.players.push(player);
    socket.join(roomId);

    // Отправляем обновление всем, включая присоединившегося
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  socket.on("startGame", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== PHASES.WAITING) return;

    const host = room.players.find(p => p.isHost);
    if (!host || host.socketId !== socket.id) return;

    if (room.players.length < 2) {
      socket.emit("error", "Нужно минимум 2 игрока");
      return;
    }

    // 🔥 Пересчитываем вместимость бункера на основе количества игроков
    const playerCount = room.players.length;
    if (playerCount <= 3) {
      room.bunkerInfo.capacity = 1; // Для 2-3 игроков → 1 место (2 раунда)
    } else if (playerCount <= 5) {
      room.bunkerInfo.capacity = 2; // Для 4-5 игроков → 2 места (2-3 раунда)
    } else {
      room.bunkerInfo.capacity = Math.max(2, Math.floor(playerCount * 0.6)); // Для 6+ → 60%
    }

    console.log(`🎮 Игра началась! Игроков: ${playerCount}, Мест в бункере: ${room.bunkerInfo.capacity}, Раундов: ~${playerCount - room.bunkerInfo.capacity}`);

    room.phase = PHASES.REVEAL;
    dealCards(room);
    startTimer(room, PHASE_TIMERS.REVEAL); // 🔥 Запускаем таймер
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  socket.on("toDiscussion", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== PHASES.REVEAL) return;
    
    const host = room.players.find(p => p.isHost);
    if (!host || host.socketId !== socket.id) return;

    room.phase = PHASES.DISCUSSION;
    stopTimer(room); // Останавливаем старый таймер
    startTimer(room, PHASE_TIMERS.DISCUSSION); // 🔥 Запускаем новый
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  socket.on("toVoting", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== PHASES.DISCUSSION) return;
    
    const host = room.players.find(p => p.isHost);
    if (!host || host.socketId !== socket.id) return;

    room.phase = PHASES.VOTING;
    room.votes = {};
    room.players.forEach(p => p.hasVoted = false);
    stopTimer(room); // Останавливаем старый таймер
    startTimer(room, PHASE_TIMERS.VOTING); // 🔥 Запускаем новый
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  socket.on("vote", ({ roomId, targetId }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== PHASES.VOTING) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || !player.isAlive) return;

    const target = room.players.find(p => p.id === targetId);
    if (!target || !target.isAlive) return;

    if (player.id === targetId) {
      socket.emit("error", "Нельзя голосовать за себя");
      return;
    }

    room.votes[player.id] = targetId;
    player.hasVoted = true;
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  socket.on("endVoting", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== PHASES.VOTING) return;
    
    const host = room.players.find(p => p.isHost);
    if (!host || host.socketId !== socket.id) return;

    stopTimer(room); // 🔥 Останавливаем таймер

    const loserId = tallyVotes(room);
    if (loserId) {
      const loser = room.players.find(p => p.id === loserId);
      if (loser) {
        loser.isAlive = false;
        
        const voteCounts = {};
        Object.values(room.votes).forEach(targetId => {
          voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
        });
        
        room.voteResult = {
          eliminatedId: loserId,
          eliminatedName: loser.name,
          votes: voteCounts
        };
      }
    }

    room.phase = PHASES.RESULTS;
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  socket.on("continueGame", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room || room.phase !== PHASES.RESULTS) return;
    
    const host = room.players.find(p => p.isHost);
    if (!host || host.socketId !== socket.id) return;

    const alivePlayers = room.players.filter(p => p.isAlive);
    
    if (alivePlayers.length <= room.bunkerInfo.capacity) {
      room.phase = PHASES.END;
      stopTimer(room); // 🔥 Останавливаем таймер
    } else {
      room.phase = PHASES.DISCUSSION;
      room.voteResult = null;
      startTimer(room, PHASE_TIMERS.DISCUSSION); // 🔥 Запускаем новый раунд
    }
    
    io.to(roomId).emit("roomUpdate", getPublicRoom(room));
  });

  // 💬 Чат
  socket.on("sendMessage", ({ roomId, message }) => {
    const room = rooms[roomId];
    if (!room) return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player) return;

    const chatMessage = {
      id: randomUUID(),
      playerId: player.id,
      playerName: player.name,
      isAlive: player.isAlive,
      message: message.trim().substring(0, 500), // Максимум 500 символов
      timestamp: Date.now()
    };

    room.messages.push(chatMessage);
    
    // Оставляем только последние 100 сообщений
    if (room.messages.length > 100) {
      room.messages = room.messages.slice(-100);
    }

    io.to(roomId).emit("newMessage", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
    
    for (const room of Object.values(rooms)) {
      const wasInRoom = room.players.some(p => p.socketId === socket.id);
      room.players = room.players.filter(p => p.socketId !== socket.id);
      
      if (wasInRoom && room.players.length > 0) {
        if (!room.players.some(p => p.isHost)) {
          room.players[0].isHost = true;
        }
        io.to(room.id).emit("roomUpdate", getPublicRoom(room));
      }
      
      if (room.players.length === 0) {
        // Очищаем таймер при удалении комнаты
        stopTimer(room);
        delete rooms[room.id];
      }
    }
  });
});

server.listen(PORT, () => console.log(`🎮 Игра "Бункер" запущена на http://localhost:${PORT}`));