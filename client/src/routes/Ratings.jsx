import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { useRatings } from '../context/RatingsContext';
import { RatingsPanel } from '../components';

function Ratings() {
  const { t } = useTranslation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const { siteSummary, refreshSiteSummary } = useRatings();

  const titleRef = useRef(null);
  const titleText = t('ratings.title');

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    const wrapEl = titleEl?.parentElement;
    if (!titleEl || !wrapEl) return;

    const fit = () => {
      titleEl.style.fontSize = '';
      const available = wrapEl.clientWidth;
      const natural = titleEl.scrollWidth;
      if (!available || !natural || natural <= available) return;

      const current = parseFloat(getComputedStyle(titleEl).fontSize);
      titleEl.style.fontSize = `${(current * available) / natural}px`;
    };

    fit();

    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [titleText]);

  return (
    <div className="ratings-page">
      <div className="hero">
        <div className="hero__title">
          <p
            className="hero__title-text"
            ref={titleRef}
          >
            {titleText}
          </p>
        </div>
        <div className="hero__divider"></div>
      </div>

      <p className="ratings-page__text">{t('ratings.intro')}</p>

      <div className="ratings-page__content">
        <RatingsPanel
          summary={siteSummary}
          onCreated={refreshSiteSummary}
        />
      </div>
    </div>
  );
}

export default Ratings;
