import React from 'react';

/**
 * Карточка персонажа текущего игрока.
 * @param {{ card: Object|null }} props
 * @returns {JSX.Element|null}
 */
const MyCard = ({ card }) => {
  if (!card) {
    return null;
  }

  return (
    <div id="yourCardDiv">
      <div className="your-card">
        <h2>Ваш персонаж</h2>
        <div className="character-info">
          <div className="character-field">
            <label>Профессия</label>
            <value>{card.profession}</value>
          </div>
          <div className="character-field">
            <label>Здоровье</label>
            <value>{card.health}</value>
          </div>
          <div className="character-field">
            <label>Хобби</label>
            <value>{card.hobby}</value>
          </div>
          <div className="character-field">
            <label>Фобия</label>
            <value>{card.phobia}</value>
          </div>
          <div className="character-field">
            <label>Характер</label>
            <value>{card.trait}</value>
          </div>
          <div className="character-field">
            <label>Багаж</label>
            <value>{card.baggage}</value>
          </div>
          <div className="character-field">
            <label>Факт</label>
            <value>{card.fact}</value>
          </div>
          <div className="character-field">
            <label>Возраст</label>
            <value>{card.age} лет</value>
          </div>
          <div className="character-field">
            <label>Пол</label>
            <value>{card.sex}</value>
          </div>
        </div>
      </div>
    </div>
  );
};

// Мемоизация: сравнение ключевых полей карты.
const areEqual = (prevProps, nextProps) => {
  const prev = prevProps.card;
  const next = nextProps.card;

  if (!prev && !next) {
    return true;
  }
  if (!prev || !next) {
    return false;
  }

  return (
    prev.profession === next.profession &&
    prev.health === next.health &&
    prev.hobby === next.hobby &&
    prev.phobia === next.phobia &&
    prev.trait === next.trait &&
    prev.baggage === next.baggage &&
    prev.fact === next.fact &&
    prev.age === next.age &&
    prev.sex === next.sex
  );
};

export default React.memo(MyCard, areEqual);
