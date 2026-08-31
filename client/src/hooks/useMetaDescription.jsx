import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SITE_URL = 'https://fitofarm.ge';

const ROUTE_KEYS = {
  '/': 'seo.home.description',
  '/about': 'seo.about.description',
  '/products': 'seo.products.description',
  '/contact': 'seo.contact.description',
  '/privacy-policy': 'seo.privacy.description',
  '/terms': 'seo.terms.description',
};

function useMetaDescription(overrideText) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    const key = ROUTE_KEYS[pathname];
    const content = overrideText || (key ? t(key) : t('seo.default.description'));
    descTag.setAttribute('content', content);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${SITE_URL}${pathname}`);
  }, [pathname, overrideText, t, i18n.language]);
}

export default useMetaDescription;
