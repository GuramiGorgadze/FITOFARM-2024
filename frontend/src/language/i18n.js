import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import ge from './locales/ge.json';

const savedLanguage = localStorage.getItem('lang') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    de: { translation: de },
    ge: { translation: ge },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
