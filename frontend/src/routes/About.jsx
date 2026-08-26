import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import FarmImage from '../assets/about-farm.png';
import MountainImage from '../assets/about-mountain.png';

function About() {
  const { t } = useTranslation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const titleText = t('about.title');

  const reasons = [
    { title: t('about.reason1Title'), text: t('about.reason1Text') },
    { title: t('about.reason2Title'), text: t('about.reason2Text') },
    { title: t('about.reason3Title'), text: t('about.reason3Text') },
  ];

  return (
    <div className="about">
      <div className="hero">
        <div className="hero__title">
          <p className="hero__title-text">{titleText}</p>
        </div>
        <div className="hero__divider"></div>
      </div>

      <div className="who">
        <div className="who__media">
          <img
            src={FarmImage}
            alt={t('about.farmAlt')}
          />
          <div className="who__media-bg"></div>
        </div>

        <div className="who__content">
          <div className="subtext">
            <div className="line"></div>
            <p>{t('about.whoTitle')}</p>
          </div>

          <p className="text">{t('about.whoText1')}</p>
          <p className="text">{t('about.whoText2')}</p>
        </div>
      </div>

      <div className="products">
        <div className="products__content">
          <div className="subtext">
            <div className="line"></div>
            <p>{t('about.productsTitle')}</p>
          </div>

          <p className="text">{t('about.productsText')}</p>
        </div>

        <div className="products__media">
          <img
            src={MountainImage}
            alt={t('about.mountainAlt')}
          />
          <div className="products__media-bg"></div>
        </div>
      </div>

      <div className="why">
        <div className="why__header">
          <div className="subtext">
            <div className="line"></div>
            <p>{t('about.whyTitle')}</p>
          </div>
        </div>

        <div className="why__grid">
          {reasons.map((reason, index) => (
            <div
              className="reason"
              key={reason.title}
            >
              <div className="reason__bg"></div>

              <div className="reason__body">
                <span className="reason__index">0{index + 1}</span>
                <h3 className="reason__title">{reason.title}</h3>
                <p className="reason__text">{reason.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
