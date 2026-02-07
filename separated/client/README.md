# Клиент: запуск и подключение (LAN и интернет)

Ниже два подробных варианта запуска, чтобы подключаться с телефона.

## Вариант 1: одна Wi‑Fi сеть (LAN, без интернета)

Идея: телефон заходит на dev‑сервер Vite на твоём ПК, Vite проксирует сокеты на сервер.

### Шаги

1. Запусти сервер на ПК:
```bash
cd /home/alek/Projects/Bunker2/separated/server
npm install
npm run dev
```

2. Запусти клиент на ПК с доступом по сети:
```bash
cd /home/alek/Projects/Bunker2/separated/client
npm install
npm run dev -- --host
```

3. Узнай IP компьютера в локальной сети:
```bash
hostname -I
```
Например: `192.168.1.50`

4. На телефоне открой:
```
http://192.168.1.50:5173
```

### Если не открывается

1. Проверь, что телефон и ПК в одной Wi‑Fi сети.
2. Открой порты 5173 и 3000 в фаерволе.

### Почему это работает

В `vite.config.js` уже настроен прокси на `http://localhost:3000`, поэтому сокеты пойдут на сервер, запущенный на ПК.

---

## Вариант 2: публичная ссылка (GitHub Pages + интернет)

Идея: сервер на ПК доступен через туннель (ngrok/cloudflared), клиент на GitHub Pages подключается к этому туннелю.

### Шаг A — поднять туннель на сервер (порт 3000)

Пример с ngrok:
```bash
ngrok http 3000
```

Он выдаст URL вида:
```
https://abcd-1234.ngrok-free.app
```

### Шаг B — научить клиент ходить на внешний сервер

1. В `separated/client/src/hooks/useGameState.js` замени:
```js
const SERVER_URL = window.location.origin;
```
на:
```js
const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;
```

2. Создай файл `separated/client/.env.production`:
```
VITE_SERVER_URL=https://abcd-1234.ngrok-free.app
```

### Шаг C — собрать и задеплоить на GitHub Pages

1. Сборка:
```bash
cd /home/alek/Projects/Bunker2/separated/client
npm run build
```

2. Опубликуй папку `dist/` в GitHub Pages.

### Краткая инструкция для GitHub Pages

1. В репозитории: Settings → Pages → Source = `GitHub Actions`.
2. Укажи `VITE_SERVER_URL` в `separated/client/.env.production`.
3. Запушь в `main`/`master` — workflow сам соберёт и задеплоит.

### Важно

1. Туннель должен быть запущен всё время, пока играют люди.
2. URL ngrok меняется на бесплатном тарифе, тогда нужно обновлять `VITE_SERVER_URL` и пересобирать клиент.

---

## Примечания

1. Для локального варианта ничего менять в коде не нужно.
2. Для публичного варианта нужна правка `useGameState.js` и `.env.production`.
