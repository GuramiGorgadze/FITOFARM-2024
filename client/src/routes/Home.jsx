import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePic from '../assets/home.webp';
import { Info } from '../components';
import { useLoader } from '../context/LoaderContext';
import { useEffect } from 'react';

function Home() {
  const { t } = useTranslation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const titleRef = useRef(null);
  const titleText = t('home.title');
  const titleSuffix = '-2024';

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const BASELINE = 100;

    const fit = () => {
      const spans = titleEl.querySelectorAll('.title__text');

      const availableWidth = titleEl.clientWidth;

      spans.forEach((el) => (el.style.fontSize = `${BASELINE}px`));
      const naturalWidth = titleEl.scrollWidth;

      if (naturalWidth === 0) return;

      const newSize = (BASELINE * availableWidth) / naturalWidth;
      spans.forEach((el) => (el.style.fontSize = `${newSize}px`));
    };

    fit();

    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [titleText, titleSuffix]);

  return (
    <>
      <div className="home">
        <div className="left">
          <div className="subtext">
            <div className="line"></div> <p>{t('home.slogan')}</p>
          </div>

          <p className="text1 text"> </p>
          <div
            className="title"
            ref={titleRef}
          >
            <p className="title__text">{titleText}</p>
            <p className="title__text green">{titleSuffix}</p>
          </div>

          <div className="divider"></div>

          <p className="text2 text">{t('home.text1')}</p>

          <p className="text3 text">{t('home.text2')}</p>

          <Link
            to="/products"
            className="cta-wrapper"
          >
            <span className="cta-background"></span>

            <span className="cta">
              {t('home.button')}
              <i className="bi bi-arrow-right"></i>
            </span>
          </Link>
        </div>

        <div className="right">
          <img
            src={HomePic}
            alt={t('home.fitoAlt')}
            loading="lazy"
          />

          <div className="background"></div>
        </div>
      </div>

      <Info />
    </>
  );
}

export default Home;
