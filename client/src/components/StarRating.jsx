import React from 'react';

// Read-only star row. Supports halves (4.5 -> 4 full + 1 half + 0 empty).
function StarRating({ value = 0, size = 'md', label }) {
  const rounded = Math.round(Math.min(Math.max(value, 0), 5) * 2) / 2;

  return (
    <span
      className={`star-rating star-rating--${size}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        let icon = 'bi-star';
        if (rounded >= n) icon = 'bi-star-fill';
        else if (rounded >= n - 0.5) icon = 'bi-star-half';

        return (
          <i
            key={n}
            className={`star-rating__star bi ${icon}`}
            aria-hidden="true"
          />
        );
      })}
    </span>
  );
}

export default StarRating;
