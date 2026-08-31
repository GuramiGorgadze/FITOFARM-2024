import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import PharmacyImage from '../assets/pharmacy-image.webp';

const FARM_MAP = {
  lat: 42.317539,
  lng: 42.908786,
  zoom: 18,
  mapType: 'k',
};

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

  const farmMapSrc = `https://www.google.com/maps?q=${FARM_MAP.lat},${FARM_MAP.lng}&z=${FARM_MAP.zoom}&t=${FARM_MAP.mapType}&output=embed`;
  const farmMapUrl = `https://www.google.com/maps?q=${FARM_MAP.lat},${FARM_MAP.lng}&z=${FARM_MAP.zoom}`;

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
          <iframe
            className="who__media-map"
            title={t('about.farmAlt')}
            src={farmMapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
          <div className="who__media-bg"></div>

          <a
            href={farmMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="who__media-link"
          >
            {t('about.viewOnMaps')}
          </a>
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
            src={PharmacyImage}
            alt={t('about.mountainAlt')}
            loading="lazy"
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
