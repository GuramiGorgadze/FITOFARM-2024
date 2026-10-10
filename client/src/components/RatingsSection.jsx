import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRatings } from '../context/RatingsContext';
import RatingBadge from './RatingBadge';
import RatingList from './RatingList';

// Homepage section: latest customer ratings + call to action.
function RatingsSection() {
  const { t } = useTranslation();
  const { siteSummary } = useRatings();

  return (
    <section className="ratings-section">
      <div className="ratings-section__head">
        <div className="ratings-section__eyebrow">
          <span className="line"></span>
          <p>{t('ratings.eyebrow')}</p>
        </div>
        <h2 className="ratings-section__title">{t('ratings.sectionTitle')}</h2>
        <RatingBadge
          summary={siteSummary}
          variant="product"
        />
      </div>

      <RatingList
        pageSize={3}
        paginate={false}
      />

      <div className="ratings-section__actions">
        <Link
          to="/ratings"
          className="ratings-section__cta"
        >
          {t('ratings.leaveRating')}
          <i className="bi bi-arrow-right"></i>
        </Link>
        {siteSummary.count > 3 && (
          <Link
            to="/ratings"
            className="ratings-section__link"
          >
            {t('ratings.seeAll')}
          </Link>
        )}
      </div>
    </section>
  );
}

export default RatingsSection;
