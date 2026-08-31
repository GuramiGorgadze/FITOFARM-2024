import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';

const SECTIONS = [
  { key: 'purpose', domId: 'purpose' },
  { key: 'ip', domId: 'ip' },
  { key: 'noAccounts', domId: 'no-accounts' },
  { key: 'liability', domId: 'liability' },
  { key: 'productUse', domId: 'product-use' },
  { key: 'changes', domId: 'changes' },
  { key: 'governingLaw', domId: 'governing-law' },
  { key: 'contact', domId: 'contact' },
];

function Terms() {
  const { t } = useTranslation();
  const [active, setActive] = useState(SECTIONS[0].domId);
  const sectionRefs = useRef({});

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ domId }) => {
      const el = document.getElementById(domId);
      if (el) {
        sectionRefs.current[domId] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  // items[] arrays need returnObjects:true to come back as arrays, not a joined string
  const liabilityItems = t('terms.sections.liability.items', { returnObjects: true });

  // The "no-accounts" body has an inline link. We interpolate a unique marker,
  // then split the resulting string around it so we can drop in a real <a>.
  const noAccountsBody = t('terms.sections.noAccounts.body', { privacyPolicyLink: '%LINK%' });
  const [noAccountsBefore, noAccountsAfter] = noAccountsBody.split('%LINK%');

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <span className="eyebrow">{t('terms.eyebrow')}</span>
        <h1>{t('terms.title')}</h1>
        <p className="updated">{t('terms.lastUpdated')}</p>
        <div className="legal-divider" />
      </div>

      <div className="legal-body">
        <nav
          className="legal-toc"
          aria-label="Terms and Conditions sections"
        >
          <span className="toc-label">{t('terms.toc.label')}</span>
          {SECTIONS.map(({ key, domId }) => (
            <a
              key={domId}
              href={`#${domId}`}
              className={active === domId ? 'active' : ''}
            >
              {t(`terms.toc.${key}`)}
            </a>
          ))}
        </nav>

        <div className="legal-content">
          <p>{t('terms.intro')}</p>

          <section id="purpose">
            <h2>{t('terms.sections.purpose.title')}</h2>
            <p>{t('terms.sections.purpose.body')}</p>
          </section>

          <section id="ip">
            <h2>{t('terms.sections.ip.title')}</h2>
            <p>{t('terms.sections.ip.body')}</p>
          </section>

          <section id="no-accounts">
            <h2>{t('terms.sections.noAccounts.title')}</h2>
            <p>
              {noAccountsBefore}
              <a href="/privacy-policy">{t('terms.sections.noAccounts.linkText')}</a>
              {noAccountsAfter}
            </p>
          </section>

          <section id="liability">
            <h2>{t('terms.sections.liability.title')}</h2>
            <p>{t('terms.sections.liability.intro')}</p>
            <ul>
              {liabilityItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="product-use">
            <h2>{t('terms.sections.productUse.title')}</h2>
            <p>{t('terms.sections.productUse.body')}</p>
          </section>

          <section id="changes">
            <h2>{t('terms.sections.changes.title')}</h2>
            <p>{t('terms.sections.changes.body')}</p>
          </section>

          <section id="governing-law">
            <h2>{t('terms.sections.governingLaw.title')}</h2>
            <p>{t('terms.sections.governingLaw.body')}</p>
          </section>

          <section id="contact">
            <h2>{t('terms.sections.contact.title')}</h2>
            <div className="contact-card">
              <p>
                <strong>{t('terms.sections.contact.name')}</strong>
              </p>
              <p>{t('terms.sections.contact.address')}</p>
              <p>{t('terms.sections.contact.telLabel')} +995 599 14 21 18</p>
              <p>{t('terms.sections.contact.emailLabel')} info@fitofarm2024.ge</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Terms;
