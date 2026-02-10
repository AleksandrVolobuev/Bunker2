# Bunker — Игра на выживание

Многопользовательская игра, где игроки решают, кто останется в бункере после апокалипсиса.

## Структура проекта

```
separated/
├── client/   # фронтенд (React + Vite)
└── server/   # бэкенд (Node.js + Socket.IO)
```

## Быстрый старт (локально)

Терминал 1 — сервер:
```bash
cd separated/server
npm install
npm run dev
```
Сервер: http://localhost:3000

Терминал 2 — клиент:
```bash
cd separated/client
npm install
npm run dev
```
Клиент: http://localhost:5173

Откройте: http://localhost:5173

## Быстрый чек-лист запуска

1. `cd separated/server`
2. `npm install`
3. `npm run dev`
4. Новый терминал: `cd separated/client`
5. `npm install`
6. `npm run dev`
7. Открыть `http://localhost:5173`

## Продакшен сборка

Сервер:
```bash
cd separated/server
npm install
npm start
```

Клиент:
```bash
cd separated/client
npm install
npm run build
```
Готовая сборка будет в `separated/client/dist`.

## Раздельный деплой клиента и сервера

По умолчанию клиент подключается к серверу по `window.location.origin`.
Если клиент и сервер будут на разных доменах, укажите адрес сервера вручную:

1. Откройте файл `separated/client/src/hooks/useGameState.js`.
2. Замените строку:
   ```js
   const SERVER_URL = window.location.origin;
   ```
   на, например:
   ```js
   const SERVER_URL = 'https://your-server.example.com';
   ```
3. Пересоберите клиент:
   ```bash
   cd separated/client
   npm run build
   ```

## Документация

- Клиент: `separated/client/README.md`
- Сервер: `separated/server/README.md`
