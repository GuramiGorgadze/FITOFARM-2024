import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { ProductAnnotation, Disclaimer, RatingBadge, RatingsPanel } from '../components';
import { getProductByHandle } from '../api/api';
import useMetaDescription from '../hooks/useMetaDescription';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useProductSchema from '../hooks/useProductSchema';
import useProductRatingSummary from '../hooks/useProductRatingSummary';

// Pharmacy logos: drop the files in this folder (adjust the path / extension if yours differ)
import aversiLogo from '../assets/pharmacies/aversi.png';
import pspLogo from '../assets/pharmacies/psp.png';
import gpcLogo from '../assets/pharmacies/gpc.png';
import pharmadepotLogo from '../assets/pharmacies/pharmadepot.png';

const SUPPORTED_LANGS = ['ka', 'en', 'ru', 'de'];

function resolveLang(lng) {
  if (!lng) return 'ka';
  const short = lng.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'ka';
}

const PHARMACIES = [
  {
    id: 'aversi',
    name: 'Aversi',
    logo: aversiLogo,
    url: 'https://www.aversi.ge/ka/aversi/act/drugDet/?MatID=144463',
  },
  {
    id: 'psp',
    name: 'PSP',
    logo: pspLogo,
    url: 'https://psp.ge/მედიკამენტები/ნევროლოგია/დამამშვიდებელი-წამალი/ფიტოსედი-phytosed-25მლ.html',
  },
  {
    id: 'gpc',
    name: 'GPC',
    logo: gpcLogo,
    url: 'https://gpc.ge/ka/details/food-supplements/neurology-and-psych/fitosedi-wveTebi-oraluri-25ml-1?product=64275',
  },
  {
    id: 'pharmadepot',
    name: 'PharmaDepot',
    logo: pharmadepotLogo,
    url: 'https://pharmadepot.ge/ka/details/food-supplements/neurology-and-psych/fitosedi-wveTebi-oraluri-25ml-1?product=209675',
  },
];

const SPEC_ROWS = [
  {
    key: 'pharmacologicalGroup',
    label: {
      ka: 'ფარმაკოლოგიური ჯგუფი',
      en: 'Pharmacological group',
      ru: 'Фармакологическая группа',
      de: 'Pharmakologische Gruppe',
    },
  },
  {
    key: 'manufacturerCountry',
    label: {
      ka: 'მწარმოებელი ქვეყანა',
      en: 'Country of manufacture',
      ru: 'Страна производитель',
      de: 'Herstellungsland',
    },
  },
  {
    key: 'manufacturer',
    label: { ka: 'მწარმოებელი', en: 'Manufacturer', ru: 'Производитель', de: 'Hersteller' },
  },
  {
    key: 'dispensingForm',
    label: { ka: 'გაცემის ფორმა', en: 'Dispensing form', ru: 'Форма отпуска', de: 'Abgabeform' },
  },
  { key: 'status', label: { ka: 'სტატუსი', en: 'Status', ru: 'Статус', de: 'Status' } },
  {
    key: 'activeSubstance',
    label: {
      ka: 'აქტიური ნივთიერება',
      en: 'Active substance',
      ru: 'Активное вещество',
      de: 'Wirkstoff',
    },
  },
  { key: 'dosage', label: { ka: 'დოზირება', en: 'Dosage', ru: 'Дозировка', de: 'Dosierung' } },
];

function ProductSingle() {
  const { handle } = useParams();
  const { t, i18n } = useTranslation();
  const lang = resolveLang(i18n.language);

  const { useDataLoader } = useLoader();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        // keeps the global loading screen up until the product has actually arrived
        const { data } = await useDataLoader(() => getProductByHandle(handle));
        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [handle]);

  useDocumentTitle(
    product?.title?.[lang] ? `${product.title[lang]} — ${t('seo.productSingle')}` : undefined
  );
  useMetaDescription(product?.shortDescription?.[lang]);
  const [ratingSummary, refreshRatingSummary] = useProductRatingSummary(handle);
  useProductSchema(product, lang, ratingSummary);

  if (loading) return null; // the global loading screen is covering the page
  if (error) return <p>{error}</p>;
  if (!product) return null;

  const {
    title,
    brandName,
    characteristics = {},
    shortDescription,
    fullAnnotation = {},
    images = [],
  } = product;
  const annotationForLang = fullAnnotation[lang];

  const annotationData = annotationForLang?.sections
    ? {
        name: brandName?.[lang]?.primary,
        nameLatin: brandName?.[lang]?.secondary,
        category: annotationForLang.category,
        form: annotationForLang.form,
        lead: annotationForLang.lead,
        sections: annotationForLang.sections,
      }
    : null;

  return (
    <>
      <div className="product-single">
        <div className="product-single__gallery">
          <img
            className="product-single__image"
            src={images[0]}
            alt={title?.[lang]}
            loading="lazy"
          />
        </div>

        <div className="product-single__info">
          <h3 className="product-single__title">{title?.[lang]}</h3>

          <RatingBadge
            summary={ratingSummary}
            href="#ratings"
            variant="product"
          />

          <h4 className="product-single__section-title">{t('productSingle.characteristics')}</h4>

          <table className="product-single__specs">
            <tbody>
              {SPEC_ROWS.map(({ key, label }) => {
                const raw = characteristics[key];
                if (!raw) return null;
                const value = Array.isArray(raw[lang]) ? raw[lang].join(', ') : raw[lang];
                if (!value) return null;
                const rowClass =
                  key === 'status'
                    ? 'product-single__specs-row product-single__specs-row--status'
                    : 'product-single__specs-row';
                return (
                  <tr
                    className={rowClass}
                    key={key}
                  >
                    <th className="product-single__specs-label">{label[lang]}</th>
                    <td className="product-single__specs-value">{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h4 className="product-single__section-title">{t('productSingle.shortDesc')}</h4>
          <h5 className="product-single__description">{shortDescription?.[lang]}</h5>

          <h4 className="product-single__section-title">
            {t('productSingle.buyHere', { defaultValue: 'შეიძინეთ აქ:' })}
          </h4>
          <ul className="product-single__pharmacies">
            {PHARMACIES.map(({ id, name, logo, url }) => (
              <li
                className="product-single__pharmacy-item"
                key={id}
              >
                <a
                  className="product-single__pharmacy"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="product-single__pharmacy-logo-wrap">
                    <img
                      className="product-single__pharmacy-logo"
                      src={logo}
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="product-single__pharmacy-name">{name}</span>
                  <span className="product-single__sr-only">
                    {t('productSingle.opensInNewTab', {
                      defaultValue: '(იხსნება ახალ ჩანართში)',
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {annotationData && (
            <a
              className="product-single__link"
              href="#full-anotation"
            >
              {t('productSingle.fullAnnotation')}
            </a>
          )}
        </div>
      </div>

      {annotationData && <ProductAnnotation data={annotationData} />}

      <Disclaimer />

      <section
        className="product-ratings"
        id="ratings"
      >
        <div className="product-ratings__head">
          <h2>{t('ratings.productSectionTitle')}</h2>
        </div>
        <RatingsPanel
          productHandle={handle}
          summary={ratingSummary}
          onCreated={refreshRatingSummary}
        />
      </section>
    </>
  );
}

export default ProductSingle;