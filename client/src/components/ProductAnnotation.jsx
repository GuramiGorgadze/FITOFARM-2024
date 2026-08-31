import React from 'react';
import { useTranslation } from 'react-i18next';

const CONTACT_REGEX = /([\w.+-]+@[\w-]+\.[\w.-]+)|(\+?\d[\d\s-]{7,}\d)/g;

function linkifyLine(line) {
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = CONTACT_REGEX.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index));
    }

    const matchedText = match[0];
    if (match[1]) {
      parts.push(
        <a
          key={key++}
          className="product-annotation__link"
          href={`mailto:${matchedText}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {matchedText}
        </a>
      );
    } else {
      const cleaned = matchedText.replace(/\s+/g, '');
      parts.push(
        <a
          key={key++}
          className="product-annotation__link"
          href={`tel:${cleaned}`}
        >
          {matchedText}
        </a>
      );
    }

    lastIndex = CONTACT_REGEX.lastIndex;
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex));
  }

  return parts;
}

function renderMultiline(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => (
    <React.Fragment key={i}>
      {linkifyLine(line)}
      {i < lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

function AnnotationTable({ table }) {
  if (!table) return null;
  const { columns = [], rows = [], footnotes = [] } = table;

  return (
    <div className="product-annotation__table-wrap">
      <table className="product-annotation__table">
        {columns.length > 0 && (
          <thead>
            <tr>
              {columns.map((col, k) => (
                <th key={k}>{col}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {footnotes.length > 0 && (
        <ul className="product-annotation__table-footnotes">
          {footnotes.map((note, n) => (
            <li key={n}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductAnnotation({ data }) {
  const { t } = useTranslation();
  if (!data) return null;

  const { name, nameLatin, category, form, lead, sections = [] } = data;

  return (
    <section
      className="product-annotation"
      id="full-anotation"
      aria-labelledby="full-anotation-title"
    >
      <h3
        id="full-anotation-title"
        className="product-annotation__title"
      >
        {t('productAnnotation')}
      </h3>

      {category && <p className="product-annotation__category">{category}</p>}

      <p className="product-annotation__name">
        „{name}“{nameLatin && <span> / „{nameLatin}“</span>}
      </p>

      {form && <p className="product-annotation__form">{form}</p>}
      {lead && <p className="product-annotation__lead">{lead}</p>}

      <div className="product-annotation__sections">
        {sections.map((section, i) => (
          <div
            className="product-annotation__section"
            key={section.id ?? i}
          >
            <h4 className="product-annotation__section-title">{section.title}</h4>

            {section.text && (
              <p className="product-annotation__section-text">{renderMultiline(section.text)}</p>
            )}

            {section.list && section.list.length > 0 && (
              <ul className="product-annotation__section-list">
                {section.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}

            {section.table && <AnnotationTable table={section.table} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductAnnotation;
