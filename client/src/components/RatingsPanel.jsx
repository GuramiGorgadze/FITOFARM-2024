import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StarRating from './StarRating';
import RatingForm from './RatingForm';
import RatingList from './RatingList';

// Full ratings block: summary + form on one side, list of ratings on the other.
// Used on the /ratings page (company-wide) and on every product page.
//   summary:   { average, count }
//   onCreated: called after a rating is saved so the parent can refresh its summary
function RatingsPanel({ productHandle, summary, onCreated }) {
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);

  const average = summary?.average || 0;
  const count = summary?.count || 0;

  const handleCreated = () => {
    setRefreshKey((k) => k + 1);
    onCreated?.();
  };

  return (
    <section className="ratings-panel">
      <div className="ratings-panel__side">
        <div className="ratings-panel__summary">
          <p className="ratings-panel__average">{count ? average.toFixed(1) : '–'}</p>
          <div className="ratings-panel__summary-meta">
            <StarRating
              value={average}
              size="lg"
              label={count ? t('ratings.ariaLabel', { average: average.toFixed(1), count }) : undefined}
            />
            <p className="ratings-panel__count">
              {count ? t('ratings.count', { count }) : t('ratings.noRatingsShort')}
            </p>
          </div>
        </div>

        <div className="ratings-panel__card">
          <div className="ratings-panel__form">
            <h3 className="ratings-panel__form-title">
              {productHandle ? t('ratings.form.productTitle') : t('ratings.form.title')}
            </h3>
            <RatingForm
              productHandle={productHandle}
              onCreated={handleCreated}
            />
          </div>
          <div
            className="ratings-panel__card-bg"
            aria-hidden="true"
          ></div>
        </div>
      </div>

      <div className="ratings-panel__main">
        <RatingList
          productHandle={productHandle}
          refreshKey={refreshKey}
        />
      </div>
    </section>
  );
}

export default RatingsPanel;
