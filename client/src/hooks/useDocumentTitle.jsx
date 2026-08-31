import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TITLE_KEYS = {
  '/': 'seo.home.title',
  '/about': 'seo.about.title',
  '/products': 'seo.products.title',
  '/contact': 'seo.contact.title',
  '/privacy-policy': 'seo.privacy.title',
  '/terms': 'seo.terms.title',
};

function useDocumentTitle(overrideTitle) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const key = TITLE_KEYS[pathname];
    document.title = overrideTitle || (key ? t(key) : t('seo.default.title'));
  }, [pathname, overrideTitle, t, i18n.language]);
}

export default useDocumentTitle;
