import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';

// Compact "stars + average + count" pill.
//   summary: { average, count }
//   to:      router path (renders <Link>)   |   href: in-page anchor (renders <a>)
//   variant: 'hero' | 'footer' | 'card' | 'product'  (styling only)
function RatingBadge({ summary, to, href, variant = 'hero', emptyLabel }) {
  const { t } = useTranslation();
  const average = summary?.average || 0;
  const count = summary?.count || 0;
  const hasRatings = count > 0;

  const className = `rating-badge rating-badge--${variant}${hasRatings ? '' : ' rating-badge--empty'}`;
  const ariaLabel = hasRatings
    ? t('ratings.ariaLabel', { average: average.toFixed(1), count })
    : emptyLabel || t('ratings.noRatingsShort');

  const content = (
    <>
      <StarRating
        value={average}
        size={variant === 'card' ? 'sm' : 'md'}
      />
      {hasRatings ? (
        <span className="rating-badge__text">
          <strong className="rating-badge__average">{average.toFixed(1)}</strong>
          <span className="rating-badge__count">{t('ratings.count', { count })}</span>
        </span>
      ) : (
        <span className="rating-badge__text rating-badge__text--empty">
          {emptyLabel || t('ratings.noRatingsShort')}
        </span>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        className={className}
        to={to}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={className}
        href={href}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className={className}
      aria-label={ariaLabel}
    >
      {content}
    </div>
  );
}

export default RatingBadge;
