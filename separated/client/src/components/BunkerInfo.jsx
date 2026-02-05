import React from 'react';

/**
 * Блок информации о бункере.
 * @param {{ room: Object|null, selectors: Object }} props
 * @returns {JSX.Element|null}
 */
const BunkerInfo = ({ room, selectors }) => {
  if (!room || room.phase === 'WAITING' || !room.bunkerInfo) {
    return null;
  }

  // Вычисления из селекторов.
  const needToEliminate = selectors?.needToEliminate ?? null;
  const currentRound = selectors?.currentRound ?? null;
  const infoBoxClass = needToEliminate > 0 ? 'info-box info-box-danger' : 'info-box info-box-safe';
  const infoCountClass = needToEliminate > 0 ? 'info-count info-count-danger' : 'info-count info-count-safe';

  return (
    <div id="bunkerInfo" className="bunker-info">
      <h2 className="bunker-title type-title">Информация о бункере</h2>
      <div className="info-grid" id="bunkerInfoGrid">
        <div className="info-box">
          <h3>Катастрофа</h3>
          <p>{room.catastrophe}</p>
        </div>
        <div className="info-box">
          <h3>Финалистов</h3>
          <p>2</p>
        </div>
        <div className="info-box">
          <h3>Раунд</h3>
          <p>{room.phase === 'END' ? 'Завершено' : currentRound ?? ''}</p>
        </div>
        <div className={infoBoxClass}>
          <h3>Осталось выбыть</h3>
          <p className={infoCountClass}>{needToEliminate > 0 ? needToEliminate : 0}</p>
        </div>
      </div>
    </div>
  );
};

export default BunkerInfo;
