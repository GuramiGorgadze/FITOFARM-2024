import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRatings } from '../api/api';
import StarRating from './StarRating';

// List of rating cards, newest first.
//   productHandle: omit for company-wide ratings
//   pageSize:      cards per request
//   paginate:      show a "load more" button
//   refreshKey:    bump to reload from page 1 (e.g. after a new rating is posted)
function RatingList({ productHandle, pageSize = 6, paginate = true, refreshKey = 0 }) {
  const { t, i18n } = useTranslation();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ignore responses from requests that were superseded
  const requestId = useRef(0);

  const load = useCallback(
    async (nextPage, replace) => {
      const id = ++requestId.current;
      setLoading(true);
      setError(null);

      try {
        const res = await getRatings({ productHandle, page: nextPage, limit: pageSize });
        if (id !== requestId.current) return;

        // never let an unexpected response shape crash the page
        if (!Array.isArray(res?.data)) throw new Error('Invalid ratings response');
        const { data, meta } = res;

        setItems((prev) => {
          if (replace) return data;
          const seen = new Set(prev.map((r) => r._id));
          return [...prev, ...data.filter((r) => !seen.has(r._id))];
        });
        setPage(nextPage);
        setHasMore(Boolean(meta?.hasMore));
      } catch (err) {
        if (id === requestId.current) setError(err.message);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [productHandle, pageSize]
  );

  useEffect(() => {
    load(1, true);
  }, [load, refreshKey]);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (error && !items.length) {
    return <p className="rating-list__message">{t('ratings.list.error')}</p>;
  }

  if (!loading && !items.length) {
    return <p className="rating-list__message">{t('ratings.list.empty')}</p>;
  }

  return (
    <div className="rating-list">
      <ul className="rating-list__items">
        {items.map((rating) => (
          <li
            className="rating-card"
            key={rating._id}
          >
            <div className="rating-card__header">
              <span
                className="rating-card__avatar"
                aria-hidden="true"
              >
                {rating.name.trim().charAt(0).toUpperCase()}
              </span>
              <div className="rating-card__meta">
                <p className="rating-card__name">{rating.name}</p>
                <time
                  className="rating-card__date"
                  dateTime={rating.createdAt}
                >
                  {formatDate(rating.createdAt)}
                </time>
              </div>
              <StarRating
                value={rating.stars}
                size="sm"
                label={t('ratings.form.starLabel', { value: rating.stars })}
              />
            </div>
            <p className="rating-card__comment">{rating.comment}</p>
          </li>
        ))}
      </ul>

      {loading && <p className="rating-list__message">{t('ratings.list.loading')}</p>}

      {paginate && hasMore && !loading && (
        <button
          className="rating-list__more"
          type="button"
          onClick={() => load(page + 1, false)}
        >
          {t('ratings.list.loadMore')}
        </button>
      )}
    </div>
  );
}

export default RatingList;