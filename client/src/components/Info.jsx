import React from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

function Info() {
  const { t } = useTranslation();
  const phone = t('info.phone');
  const email = t('info.email');

  return (
    <section className="info">
      <div className="left">
        <div className="addresses">
          <div className="address">
            <i
              className="icon bi bi-geo-alt"
              aria-hidden="true"
            />
            <div>
              <p className="address__title">{t('info.office1Title')}</p>
              <a
                target="blank"
                href="https://maps.app.goo.gl/JRX2r2tAQVmSMSjY7"
                rel="noopener noreferrer"
              >
                <p className="address__line">{t('info.office1Address')}</p>
              </a>
            </div>
          </div>

          <div className="address">
            <i
              className="icon bi bi-geo-alt"
              aria-hidden="true"
            />
            <div>
              <p className="address__title">{t('info.office2Title')}</p>

              <a
                target="blank"
                href="https://maps.app.goo.gl/RyFjZqjN9iscru2S6"
                rel="noopener noreferrer"
              >
                <p className="address__line">{t('info.office2Address')}</p>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-links">
          <a
            className="contact-link"
            href={`tel:${phone.replace(/\s+/g, '')}`}
          >
            <i
              className="icon bi bi-telephone"
              aria-hidden="true"
            />
            <span>{phone}</span>
          </a>

          <a
            className="contact-link"
            href={`mailto:${email}`}
            target="blank"
          >
            <i
              className="icon bi bi-envelope"
              aria-hidden="true"
            />
            <span>{email}</span>
          </a>
        </div>
      </div>

      <div
        className="divider"
        aria-hidden="true"
      />

      <Link
        to="/"
        className="right"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <img
          className="logo"
          src={Logo}
          alt={t('info.logoAlt')}
        />
        <p className="wordmark">
          {t('nav.title')}
          <span className="wordmark__year">-2024</span>
        </p>
      </Link>
    </section>
  );
}

export default Info;
