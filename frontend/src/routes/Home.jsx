import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePic from '../assets/home.png';
import { Info } from '../components'

function Home() {
  const { t } = useTranslation();

  return (
    <>
            <div className="home">
      <div className="left">
        <p className="text1 text">{t('home.text1')}</p>
        <p className="text2 text">{t('home.text2')}</p>
        <p className="text3 text">{t('home.text3')}</p>

        <Link to="/products" className="cta">
          <span>{t('home.button')}</span>
          <svg className="cta__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="right">
        <img
          src={HomePic}
          alt={t('home.fitoAlt')}
        />
      </div>

    </div>

    <Info />
    </>
  );
}

export default Home;