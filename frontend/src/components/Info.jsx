import React from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../assets/logo.png';

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
              <p className="address__line">{t('info.office1Address')}</p>
            </div>
          </div>

          <div className="address">
            <i
              className="icon bi bi-geo-alt"
              aria-hidden="true"
            />
            <div>
              <p className="address__title">{t('info.office2Title')}</p>
              <p className="address__line">{t('info.office2Address')}</p>
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

      <div className="right">
        <img
          className="logo"
          src={Logo}
          alt={t('info.logoAlt')}
        />
        <p className="wordmark">
          FITOFARM-<span className="wordmark__year">2024</span>
        </p>
      </div>
    </section>
  );
}

export default Info;
