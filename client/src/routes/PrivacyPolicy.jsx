import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';

const SECTIONS = [
  { key: 'whatWeCollect', domId: 'what-we-collect' },
  { key: 'howWeUseIt', domId: 'how-we-use-it' },
  { key: 'storage', domId: 'storage' },
  { key: 'sharing', domId: 'sharing' },
  { key: 'yourRights', domId: 'your-rights' },
  { key: 'children', domId: 'children' },
  { key: 'changes', domId: 'changes' },
  { key: 'contact', domId: 'contact' },
];

function PrivacyPolicy() {
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

  const whatWeCollectItems = t('privacy.sections.whatWeCollect.items', { returnObjects: true });
  const howWeUseItItems = t('privacy.sections.howWeUseIt.items', { returnObjects: true });
  const sharingItems = t('privacy.sections.sharing.items', { returnObjects: true });

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <span className="eyebrow">{t('privacy.eyebrow')}</span>
        <h1>{t('privacy.title')}</h1>
        <p className="updated">{t('privacy.lastUpdated')}</p>
        <div className="legal-divider" />
      </div>

      <div className="legal-body">
        <nav
          className="legal-toc"
          aria-label="Privacy Policy sections"
        >
          <span className="toc-label">{t('privacy.toc.label')}</span>
          {SECTIONS.map(({ key, domId }) => (
            <a
              key={domId}
              href={`#${domId}`}
              className={active === domId ? 'active' : ''}
            >
              {t(`privacy.toc.${key}`)}
            </a>
          ))}
        </nav>

        <div className="legal-content">
          <p>{t('privacy.intro')}</p>

          <section id="what-we-collect">
            <h2>{t('privacy.sections.whatWeCollect.title')}</h2>
            <p>{t('privacy.sections.whatWeCollect.intro')}</p>
            <ul>
              {whatWeCollectItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p>{t('privacy.sections.whatWeCollect.note')}</p>
          </section>

          <section id="how-we-use-it">
            <h2>{t('privacy.sections.howWeUseIt.title')}</h2>
            <p>{t('privacy.sections.howWeUseIt.intro')}</p>
            <ul>
              {howWeUseItItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p>{t('privacy.sections.howWeUseIt.note')}</p>
          </section>

          <section id="storage">
            <h2>{t('privacy.sections.storage.title')}</h2>
            <p>{t('privacy.sections.storage.body')}</p>
          </section>

          <section id="sharing">
            <h2>{t('privacy.sections.sharing.title')}</h2>
            <p>{t('privacy.sections.sharing.intro')}</p>
            <ul>
              {sharingItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="your-rights">
            <h2>{t('privacy.sections.yourRights.title')}</h2>
            <p>{t('privacy.sections.yourRights.body')}</p>
          </section>

          <section id="children">
            <h2>{t('privacy.sections.children.title')}</h2>
            <p>{t('privacy.sections.children.body')}</p>
          </section>

          <section id="changes">
            <h2>{t('privacy.sections.changes.title')}</h2>
            <p>{t('privacy.sections.changes.body')}</p>
          </section>

          <section id="contact">
            <h2>{t('privacy.sections.contact.title')}</h2>
            <div className="contact-card">
              <p>
                <strong>{t('privacy.sections.contact.name')}</strong>
              </p>
              <p>{t('privacy.sections.contact.address')}</p>
              <p>{t('privacy.sections.contact.telLabel')} +995 599 14 21 18</p>
              <p>{t('privacy.sections.contact.emailLabel')} info@fitofarm2024.ge</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
