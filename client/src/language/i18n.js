import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import ka from './locales/ka.json';

const savedLanguage = localStorage.getItem('lang') || 'ka';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    de: { translation: de },
    ka: { translation: ka },
  },
  lng: savedLanguage,
  fallbackLng: 'ka',
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = savedLanguage;
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
