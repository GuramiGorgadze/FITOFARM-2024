import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['ka', 'en', 'ru', 'de'];

function resolveLang(lng) {
  if (!lng) return 'ka';
  const short = lng.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'ka';
}

function ProductCard({ product }) {
  const { i18n, t } = useTranslation();
  const lang = resolveLang(i18n.language);

  if (!product) return null;

  const title = product.title?.[lang] || product.title?.ka || '';
  const size = product.characteristics?.dosage?.[lang] || '';
  const image = product.images?.[0];

  return (
    <Link
      className="product-card"
      to={`/products/${product._id}`}
    >
      <div
        className="product-card__bg"
        aria-hidden="true"
      ></div>

      <div className="product-card__content">
        <div className="product-card__image-wrap">
          <img
            className="product-card__image"
            src={image}
            alt={title}
            loading="lazy"
            width="400"
            height="400"
          />
        </div>

        <div className="product-card__info">
          <h3 className="product-card__title">{title}</h3>
          {size && <span className="product-card__size">{size}</span>}
        </div>

        <span className="product-card__button-wrapper">
          <span className="button-background"></span>
          <span className="button">
            {t('productCard.readMore')}
            <i className="bi bi-arrow-right"></i>
          </span>
        </span>
      </div>
    </Link>
  );
}

export default ProductCard;
