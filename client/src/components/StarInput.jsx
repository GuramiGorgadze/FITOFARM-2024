import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Accessible 1-5 star picker built on native radio inputs
// (keyboard: arrow keys move between stars, Tab enters/leaves the group).
function StarInput({ value = 0, onChange, disabled = false }) {
  const { t } = useTranslation();
  const name = useId();
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <fieldset
      className="star-input"
      disabled={disabled}
      onMouseLeave={() => setHover(0)}
    >
      <legend className="star-input__legend">{t('ratings.form.yourRating')}</legend>

      <div className="star-input__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className="star-input__star"
            onMouseEnter={() => setHover(n)}
          >
            <input
              className="star-input__radio"
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              aria-label={t('ratings.form.starLabel', { value: n })}
            />
            <i
              className={`star-input__icon bi ${n <= shown ? 'bi-star-fill' : 'bi-star'}`}
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default StarInput;
