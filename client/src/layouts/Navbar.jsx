import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import flagEN from '../assets/flags/flag-en.webp';
import flagRU from '../assets/flags/flag-ru.webp';
import flagDE from '../assets/flags/flag-de.webp';
import flagKA from '../assets/flags/flag-ka.webp';
import clsx from 'clsx';
import Logo from '../assets/logo.webp';

const languages = [
  { code: 'en', label: 'English', flag: flagEN },
  { code: 'ru', label: 'Русский', flag: flagRU },
  { code: 'de', label: 'Deutsch', flag: flagDE },
  { code: 'ka', label: 'ქართული', flag: flagKA },
];

const CALL_OPTIONS_ID = 'navbar-call-options';

function Navbar() {
  const { t, i18n } = useTranslation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [currentLangCode, setCurrentLangCode] = useState(i18n.resolvedLanguage || i18n.language);
  const langDropdownRef = useRef(null);
  const callRef = useRef(null);

  const bigRef = useRef(null);
  const smallRef = useRef(null);

  const phones = [t('info.phone1'), t('info.phone2')];

  useEffect(() => {
    const handleLanguageChanged = (lng) => setCurrentLangCode(lng);
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n]);

  const currentLanguage = languages.find((lang) => lang.code === currentLangCode) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (callRef.current && !callRef.current.contains(event.target)) {
        setIsCallOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLangOpen(false);
        setIsCallOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setIsLangOpen(false);
  };

  useLayoutEffect(() => {
    const bigEl = bigRef.current;
    const smallEl = smallRef.current;
    if (!bigEl || !smallEl) return;

    const BASELINE = 20;
    const MIN_SIZE = 6;
    const MAX_SIZE = 24;

    const fit = () => {
      const targetWidth = bigEl.getBoundingClientRect().width;
      if (!targetWidth) return;

      smallEl.style.fontSize = `${BASELINE}px`;
      const naturalWidth = smallEl.scrollWidth;
      if (!naturalWidth) return;

      const raw = (BASELINE * targetWidth) / naturalWidth;
      smallEl.style.fontSize = `${Math.min(MAX_SIZE, Math.max(MIN_SIZE, raw))}px`;
    };

    fit();

    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    const ro = new ResizeObserver(fit);
    ro.observe(bigEl);

    return () => ro.disconnect();
  }, []);

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/">
          <div className="name">
            <h2
              className="big"
              ref={bigRef}
            >
              {t('nav.title')}
              <span className="year">-2024</span>
            </h2>
            <h2
              className="small"
              ref={smallRef}
            >
              {t('nav.slogan')}
            </h2>
          </div>
          <img
            src={Logo}
            alt="Fito Farm logo"
            loading="lazy"
          />
        </Link>
      </div>

      <div className="center">
        <NavLink to="/about">{t('nav.about')}</NavLink>
        <NavLink to="/products/fitosed-25ml">{t('nav.fitosed')}</NavLink>
        <NavLink to="/products/diabetol-1">{t('nav.diabetol-1')}</NavLink>
        <NavLink to="/contact">{t('nav.contact')}</NavLink>
      </div>

      <div className="right">
        <div
          className="language-dropdown"
          ref={langDropdownRef}
        >
          <button
            className="dropdown-trigger"
            onClick={() => {
              setIsLangOpen((prev) => !prev);
              setIsCallOpen(false);
            }}
            type="button"
          >
            <img
              src={currentLanguage.flag}
              alt={currentLanguage.label}
              className="flag"
              loading="lazy"
            />
            <span>{currentLanguage.label}</span>
            <span className={clsx('arrow', { open: isLangOpen })}>
              <i className="bi bi-chevron-down"></i>
            </span>
          </button>

          {isLangOpen && (
            <ul className="dropdown-options">
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  className={clsx('dropdown-option', {
                    active: currentLangCode === lang.code,
                  })}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <img
                    src={lang.flag}
                    alt={lang.label}
                    className="flag"
                    loading="lazy"
                  />
                  <span>{lang.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        className="call-fab"
        ref={callRef}
      >
        <button
          className="call-trigger"
          type="button"
          aria-haspopup="true"
          aria-expanded={isCallOpen}
          aria-controls={CALL_OPTIONS_ID}
          onClick={() => {
            setIsCallOpen((prev) => !prev);
            setIsLangOpen(false);
          }}
        >
          <i
            className="bi bi-telephone-fill"
            aria-hidden="true"
          ></i>
          <span>{t('nav.call')}</span>
        </button>

        {isCallOpen && (
          <ul
            className="call-options"
            id={CALL_OPTIONS_ID}
          >
            {phones.map((phone) => (
              <li key={phone}>
                <a
                  className="call-option"
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  onClick={() => setIsCallOpen(false)}
                >
                  <i
                    className="bi bi-telephone"
                    aria-hidden="true"
                  ></i>
                  <span>{phone}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;