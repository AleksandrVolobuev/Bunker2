import React, { useEffect, useRef, useState } from 'react';

/**
 * Чат комнаты.
 * @param {{ isVisible: boolean, messages: Array, onSendMessage: Function }} props
 * @returns {JSX.Element|null}
 */
const Chat = ({ isVisible, messages, onSendMessage }) => {
  // Локальное состояние ввода сообщения.
  const [draft, setDraft] = useState('');
  // Ссылка на контейнер сообщений для автоскролла.
  const messagesRef = useRef(null);

  // Автоскролл при новых сообщениях.
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Отправка сообщения.
  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }
    onSendMessage(trimmed);
    setDraft('');
  };

  // Быстрая отправка по Enter.
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div id="chatContainer" className="chat-container">
      <div className="chat-header">💬 Чат</div>
      <div className="chat-messages" id="chatMessages" ref={messagesRef}>
        {/* Список сообщений */}
        {messages.map((message) => {
          const isSystem = Boolean(message.isSystem);
          return (
            <div
              key={message.id ?? `${message.playerId}-${message.timestamp}`}
              className={`chat-message ${!message.isAlive ? 'dead' : ''} ${isSystem ? 'system' : ''}`.trim()}
            >
              <div className="chat-message-header">
                <span className="chat-message-author">
                  {isSystem ? 'Система' : message.playerName}
                  {!message.isAlive && !isSystem ? ' 💀' : ''}
                </span>
                <span className="chat-message-time">{message.timeStr || ''}</span>
              </div>
              <div className="chat-message-text">{message.message}</div>
            </div>
          );
        })}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          id="chatInput"
          placeholder="Введите сообщение..."
          maxLength={500}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="chat-send-btn" onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
};

export default React.memo(Chat);
