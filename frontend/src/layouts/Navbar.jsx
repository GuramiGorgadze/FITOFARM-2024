import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import flagEN from '../assets/flags/flag-en.png';
import flagRU from '../assets/flags/flag-ru.png';
import flagDE from '../assets/flags/flag-de.png';
import flagGE from '../assets/flags/flag-ge.png';
import clsx from 'clsx';
import Logo from '../assets/logo.png';

const languages = [
  { code: 'en', label: 'English', flag: flagEN },
  { code: 'ru', label: 'Русский', flag: flagRU },
  { code: 'de', label: 'Deutsch', flag: flagDE },
  { code: 'ge', label: 'ქართული', flag: flagGE },
];

function Navbar() {
  const { t, i18n } = useTranslation();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [currentLangCode, setCurrentLangCode] = useState(i18n.resolvedLanguage || i18n.language);
  const langDropdownRef = useRef(null);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setIsLangOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="left">
        <Link to="/">
          <div className="name">
            <h2 className="big">FITOFARM-2024</h2>
            <h2 className="small">A Natural Path to Peacefulness</h2>
          </div>
          <img
            src={Logo}
            alt="Fito Farm logo"
          />
        </Link>
      </div>

      <div className="center">
        <NavLink to="/about">{t('nav.about')}</NavLink>
        <NavLink to="/products">{t('nav.products')}</NavLink>
        <NavLink to="/contact">{t('nav.contact')}</NavLink>
      </div>

      <div className="right">
        <div
          className="language-dropdown"
          ref={langDropdownRef}
        >
          <button
            className="dropdown-trigger"
            onClick={() => setIsLangOpen((prev) => !prev)}
            type="button"
          >
            <img
              src={currentLanguage.flag}
              alt={currentLanguage.label}
              className="flag"
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
                  />
                  <span>{lang.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
