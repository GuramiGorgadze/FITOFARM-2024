import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';

function NotFound() {
  const { t } = useTranslation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const titleRef = useRef(null);
  const titleText = t('notFound.title');

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const BASELINE = 44;

    const fit = () => {
      const availableWidth = titleEl.parentElement?.clientWidth;
      if (!availableWidth) return;

      titleEl.style.fontSize = `${BASELINE}px`;
      const naturalWidth = titleEl.scrollWidth;
      if (!naturalWidth) return;

      titleEl.style.fontSize = `${(BASELINE * availableWidth) / naturalWidth}px`;
    };

    fit();

    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [titleText]);

  return (
    <div className="notfound">
      <div className="notfound__content">
        <div className="notfound__subtext">
          <span className="line"></span>
          <p>{t('notFound.eyebrow')}</p>
        </div>

        <h1
          className="notfound__title"
          ref={titleRef}
        >
          {titleText}
        </h1>

        <div className="notfound__divider"></div>

        <p className="notfound__text">{t('notFound.text')}</p>

        <Link
          to="/"
          className="notfound__cta-wrapper"
        >
          <span className="notfound__cta-background"></span>
          <span className="notfound__cta">
            {t('notFound.button')}
            <i className="bi bi-arrow-left"></i>
          </span>
        </Link>
      </div>

      <div className="notfound__visual">
        <div className="notfound__badge">
          <span
            className="notfound__code"
            aria-hidden="true"
          >
            404
          </span>
        </div>
        <div className="notfound__badge-bg"></div>
      </div>
    </div>
  );
}

export default NotFound;
