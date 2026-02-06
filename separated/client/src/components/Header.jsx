import React from 'react';

/**
 * Шапка приложения.
 * @param {{ musicEnabled: boolean, onToggleMusic: Function }} props
 * @returns {JSX.Element}
 */
const Header = ({ musicEnabled, onToggleMusic }) => (
  <div className="header">
    <h1 className="title type-title">БУНКЕР</h1>
    <p className="subtitle type-subtitle">Игра на выживание</p>
    <div className="header-actions">
      <button
        type="button"
        className="btn btn-secondary type-button music-toggle"
        onClick={onToggleMusic}
        aria-pressed={musicEnabled}
      >
        Музыка: {musicEnabled ? 'Вкл' : 'Выкл'}
      </button>
    </div>
  </div>
);

export default Header;
