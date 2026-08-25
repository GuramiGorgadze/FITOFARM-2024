import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

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
            <a
              className="link"
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className="bi bi-youtube"
                aria-hidden="true"
              />
              YouTube
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
            <div className="link static">{t('info.office1Address')}</div>
            <div className="link static">{t('info.office2Address')}</div>
            <div className="link static">
              <i
                className="bi bi-telephone"
                aria-hidden="true"
              />
              {t('info.phone')}
            </div>
            <div className="link static">
              <i
                className="bi bi-envelope"
                aria-hidden="true"
              />
              info@fitofarm.ge
            </div>
          </div>
        </div>

        <div className="column brand">
          <div className="title">
            <img
              className="logo"
              src={Logo}
              alt={t('info.logoAlt')}
            />
            <p className="wordmark">
              {t('home.title')}
              <span className="wordmark__year">-2024</span>
            </p>
          </div>
          <p className="slogan">{t('footer.slogan')}</p>
        </div>
      </div>

      <div className="divider-footer" />

      <div className="bottom">
        <p>{t('footer.copyright', { year })}</p>
      </div>
    </footer>
  );
}

export default Footer;
