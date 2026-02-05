import React, { useMemo, useState } from 'react';

const FIELD_OPTIONS = [
  { value: 'profession', label: 'Профессия' },
  { value: 'health', label: 'Здоровье' },
  { value: 'hobby', label: 'Хобби' },
  { value: 'phobia', label: 'Фобия' },
  { value: 'trait', label: 'Характер' },
  { value: 'baggage', label: 'Багаж' },
  { value: 'fact', label: 'Факт' },
  { value: 'age', label: 'Возраст' },
  { value: 'sex', label: 'Пол' }
];

/**
 * Карта персонажа текущего игрока с возможностью раскрытия одного поля за раунд.
 * @param {{ card: Object|null, canReveal: boolean, onReveal: Function }} props
 * @returns {JSX.Element|null}
 */
const MyCard = ({ card, canReveal, onReveal }) => {
  const defaultField = useMemo(() => 'profession', []);
  const [selectedField, setSelectedField] = useState(defaultField);

  if (!card) {
    return null;
  }

  const handleReveal = () => {
    onReveal(selectedField || 'profession');
  };

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

        <div className="my-card-actions">
          <label className="my-card-label" htmlFor="revealField">Что показать:</label>
          <select
            id="revealField"
            className="my-card-select"
            value={selectedField}
            onChange={(event) => setSelectedField(event.target.value)}
            disabled={!canReveal}
          >
            {FIELD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={handleReveal}
            disabled={!canReveal}
          >
            Показать
          </button>
          {!canReveal ? (
            <p className="my-card-hint">Карта уже раскрыта в этом раунде.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

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
    prev.sex === next.sex &&
    prevProps.canReveal === nextProps.canReveal
  );
};

export default React.memo(MyCard, areEqual);
