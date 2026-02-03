import React from 'react';

/**
 * Отображение таймера фазы.
 * @param {{ seconds: number|null|undefined }} props
 * @returns {JSX.Element|null}
 */
const Timer = ({ seconds }) => {
  if (seconds === null || seconds === undefined) {
    return null;
  }

  // Форматирование времени.
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${minutes}:${secs.toString().padStart(2, '0')}`;
  const isWarning = seconds <= 30;

  return (
    <div id="timerDisplay">
      <div className={`timer-display ${isWarning ? 'warning' : ''}`.trim()}>
        <div className="timer-label">⏱️ Осталось времени</div>
        <div className={`timer-time ${isWarning ? 'warning' : ''}`.trim()}>{timeStr}</div>
      </div>
    </div>
  );
};

export default Timer;
