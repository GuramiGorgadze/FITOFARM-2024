import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.webp';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const phone = t('info.phone');
  const email = t('info.email');

  return (
    <footer className="footer">
      <div className="top">
        <div className="column">
          <h2>{t('footer.legalTitle')}</h2>
          <div className="links">
            <Link
              className="link"
              to="/privacy-policy"
            >
              {t('footer.privacyPolicy')}
            </Link>
            <Link
              className="link"
              to="/terms"
            >
              {t('footer.terms')}
            </Link>
          </div>
        </div>

        <div className="column">
          <h2>{t('footer.followTitle')}</h2>
          <div className="links">
            <a
              className="link"
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className="bi bi-facebook"
                aria-hidden="true"
              />
              Facebook
            </a>
            <a
              className="link"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className="bi bi-linkedin"
                aria-hidden="true"
              />
              LinkedIn
            </a>
            <a
              className="link"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className="bi bi-instagram"
                aria-hidden="true"
              />
              Instagram
            </a>
          </div>
        </div>

        <div className="column">
          <h2>{t('footer.contactTitle')}</h2>
          <div className="links">
            <Link
              className="link"
              to="/contact"
            >
              {t('footer.contact')}
            </Link>
          </div>
        </div>

        <div className="column">
          <h2>{t('footer.infoTitle')}</h2>
          <div className="links">
            <a
              target="blank"
              href="https://maps.app.goo.gl/JRX2r2tAQVmSMSjY7"
              rel="noopener noreferrer"
            >
              <div className="link ">{t('info.office1Address')}</div>
            </a>
            <a
              target="blank"
              href="https://maps.app.goo.gl/RyFjZqjN9iscru2S6"
              rel="noopener noreferrer"
            >
              <div className="link ">{t('info.office2Address')}</div>
            </a>
            <a href={`tel:${phone.replace(/\s+/g, '')}`}>
              {' '}
              <div className="link">
                <i
                  className="bi bi-telephone"
                  aria-hidden="true"
                />
                {t('info.phone')}
              </div>
            </a>
            <a
              className="contact-link"
              href={`mailto:${email}`}
              target="blank"
            >
              <div className="link">
                <i
                  className="bi bi-envelope"
                  aria-hidden="true"
                />
                info@fitofarm2024.ge
              </div>
            </a>
          </div>
        </div>

        <div className="column brand">
          <Link
            to="/"
            className="title"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              className="logo"
              src={Logo}
              alt={t('info.logoAlt')}
              loading="lazy"
            />
            <p className="wordmark">
              {t('home.title')}
              <span className="wordmark__year">-2024</span>
            </p>
          </Link>
          <p className="slogan">{t('footer.slogan')}</p>
        </div>
      </div>

      <div className="divider-footer" />

      <div className="bottom">
        <p>{t('footer.copyright', { year })}</p>
        <p className="credit">
          <i
            className="bi bi-code-slash"
            aria-hidden="true"
          />
          {t('footer.createdBy')}{' '}
          <a
            className="link"
            href="https://linktr.ee/gurami.gorgadze"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('footer.name')}
          </a>{' '}
          {t('footer.tail')}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
