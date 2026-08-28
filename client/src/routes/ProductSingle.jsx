import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { ProductAnnotation } from '../components';
import { getProductById } from '../api/api';
import Phytosedium from '../assets/home.png';

const SUPPORTED_LANGS = ['ka', 'en', 'ru', 'de'];

function resolveLang(lng) {
  if (!lng) return 'ka';
  const short = lng.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'ka';
}

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
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = resolveLang(i18n.language);

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const { data } = await getProductById(id);
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
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return null;

  const {
    title,
    brandName,
    characteristics = {},
    shortDescription,
    fullAnnotation = {},
    image,
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
            src={image || Phytosedium}
            alt={title?.[lang]}
          />
        </div>

        <div className="product-single__info">
          <h3 className="product-single__title">{title?.[lang]}</h3>

          <h4 className="product-single__section-title">{t('productSingle.characteristics')}</h4>

          <table className="product-single__specs">
            <tbody>
              {SPEC_ROWS.map(({ key, label }) => {
                const raw = characteristics[key];
                if (!raw) return null;
                const value = Array.isArray(raw[lang]) ? raw[lang].join(', ') : raw[lang];
                if (!value) return null;
                return (
                  <tr
                    className="product-single__specs-row"
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
    </>
  );
}

export default ProductSingle;