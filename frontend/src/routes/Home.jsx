import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePic from '../assets/home.png';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="home">
      <div className="left">
        <p className="text1 text">{t('home.text1')}</p>
        <p className="text2 text">{t('home.text2')}</p>
        <p className="text3 text">{t('home.text3')}</p>

        <Link to="/products" className="cta">
          {t('home.button')}
        </Link>
      </div>

      <div className="right">
        <img
          src={HomePic}
          alt={t('home.fitoAlt')}
        />
      </div>
    </div>
  );
}

export default Home;