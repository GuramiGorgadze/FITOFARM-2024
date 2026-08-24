import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HomePic from '../assets/home.png';
import { Info } from '../components';
import { useLoader } from '../context/LoaderContext';
import { useEffect } from 'react';

function Home() {
  const { t } = useTranslation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  return (
    <>
      <div className="home">
        <div className="left">
          <div className="subtext">
            <div className="line"></div> <p>ბუნებრივი გზა სიმშვიდისკენ</p>
          </div>

          <p className="text1 text"> </p>
          <div className="title">
            <p className="title__text">ფიტოფარმ</p>
            <p className="title__text green">-2024</p>
          </div>

          <div className="divider"></div>

          <p className="text2 text">{t('home.text2')}</p>

          <p className="text3 text">{t('home.text3')}</p>

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
          />

          <div className="background"></div>
        </div>
      </div>

      <Info />
    </>
  );
}

export default Home;
