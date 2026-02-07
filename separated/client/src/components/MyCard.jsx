import React, { useEffect, useMemo, useState } from 'react';

const FIELD_LABELS = {
  profession: 'Профессия',
  health: 'Здоровье',
  hobby: 'Хобби',
  phobia: 'Фобия',
  trait: 'Характер',
  baggage: 'Багаж',
  fact: 'Факт',
  age: 'Возраст',
  sex: 'Пол'
};

const FIELD_ORDER = [
  'profession',
  'health',
  'hobby',
  'phobia',
  'trait',
  'baggage',
  'fact',
  'age',
  'sex'
];

/**
 * Карта персонажа текущего игрока с возможностью раскрытия одного поля за раунд.
 * @param {{ card: Object|null, cardFields: string[], canReveal: boolean, onReveal: Function }} props
 * @returns {JSX.Element|null}
 */
const MyCard = ({ card, cardFields, canReveal, onReveal }) => {
  const defaultField = useMemo(() => 'profession', []);
  const [selectedField, setSelectedField] = useState(defaultField);

  if (!card) {
    return null;
  }

  const availableFields = useMemo(() => {
    if (Array.isArray(cardFields) && cardFields.length > 0) {
      return FIELD_ORDER.filter((field) => cardFields.includes(field));
    }
    return FIELD_ORDER.filter((field) => field in card);
  }, [cardFields, card]);

  useEffect(() => {
    if (availableFields.length > 0 && !availableFields.includes(selectedField)) {
      setSelectedField(availableFields[0]);
    }
  }, [availableFields, selectedField]);

  const handleReveal = () => {
    const fieldToReveal = selectedField || availableFields[0] || 'profession';
    onReveal(fieldToReveal);
  };

  return (
    <div id="yourCardDiv">
      <div className="your-card">
        <h2 className="type-title">Ваш персонаж</h2>
        {card.professionImage ? (
          <div className="my-card-image-wrap">
            <img
              className="my-card-image"
              src={`/images/${card.professionImage}`}
              alt={`Профессия: ${card.profession}`}
              loading="lazy"
            />
          </div>
        ) : null}
        <div className="character-info">
          {availableFields.map((field) => {
            const label = FIELD_LABELS[field] || field;
            const rawValue = card[field];
            const value = field === 'age' ? `${rawValue} лет` : rawValue;
            return (
              <div className="character-field" key={field}>
                <label className="type-meta">{label}</label>
                <value>{value}</value>
              </div>
            );
          })}
        </div>

        <div className="my-card-actions">
          <label className="my-card-label type-meta" htmlFor="revealField">Что показать:</label>
          <select
            id="revealField"
            className="my-card-select"
            value={selectedField}
            onChange={(event) => setSelectedField(event.target.value)}
            disabled={!canReveal}
          >
            {availableFields.map((field) => (
              <option key={field} value={field}>{FIELD_LABELS[field] || field}</option>
            ))}
          </select>
          <button
            className="btn btn-secondary type-button"
            onClick={handleReveal}
            disabled={!canReveal}
          >
            Показать
          </button>
          {!canReveal ? (
            <p className="my-card-hint type-meta">Карта уже раскрыта в этом раунде.</p>
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
    prev.professionImage === next.professionImage &&
    prevProps.canReveal === nextProps.canReveal &&
    (prevProps.cardFields || []).join('|') === (nextProps.cardFields || []).join('|')
  );
};

export default React.memo(MyCard, areEqual);
