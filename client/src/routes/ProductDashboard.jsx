import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createProduct, uploadImage } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';

const LANGS = ['ka', 'en', 'ru', 'de'];
const LANG_LABELS = { ka: 'ქართული', en: 'English', ru: 'Русский', de: 'Deutsch' };

const CHARACTERISTIC_KEYS = [
  'pharmacologicalGroup',
  'manufacturerCountry',
  'manufacturer',
  'dispensingForm',
  'status',
  'activeSubstance',
  'dosage',
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB — keep in sync with the backend upload limit

let imageIdCounter = 0;
const makeImageId = () => `img-${Date.now()}-${imageIdCounter++}`;

// ---- empty-state builders, mirroring the Product schema ----

const emptyTranslation = () => ({ ka: '', en: '', ru: '', de: '' });

const emptyBrandName = () =>
  LANGS.reduce((acc, lang) => {
    acc[lang] = { primary: '', secondary: '' };
    return acc;
  }, {});

const emptyCharacteristics = () => ({
  pharmacologicalGroup: emptyTranslation(),
  manufacturerCountry: emptyTranslation(),
  manufacturer: emptyTranslation(),
  dispensingForm: emptyTranslation(),
  status: emptyTranslation(),
  // stored as a comma-separated string per language in the form,
  // converted to an array per language on submit
  activeSubstance: emptyTranslation(),
  dosage: emptyTranslation(),
});

const emptySection = () => ({
  title: '',
  text: '',
  list: [],
  hasTable: false,
  table: { columns: [], rows: [], footnotes: [] },
});

const emptyAnnotationLang = () => ({
  category: '',
  form: '',
  lead: '',
  sections: [],
});

const emptyFullAnnotation = () =>
  LANGS.reduce((acc, lang) => {
    acc[lang] = emptyAnnotationLang();
    return acc;
  }, {});

const initialFormState = () => ({
  handle: '',
  image: { id: makeImageId(), url: '' },
  title: emptyTranslation(),
  brandName: emptyBrandName(),
  characteristics: emptyCharacteristics(),
  shortDescription: emptyTranslation(),
  fullAnnotation: emptyFullAnnotation(),
});

const clone = (value) => JSON.parse(JSON.stringify(value));

// converts the form state into the payload shape the API/schema expects
function buildPayload(formData) {
  const payload = clone(formData);

  const imageUrl = formData.image.url.trim();
  payload.images = imageUrl ? [imageUrl] : [];
  delete payload.image;

  LANGS.forEach((lang) => {
    const raw = payload.characteristics.activeSubstance[lang];
    payload.characteristics.activeSubstance[lang] = raw
      ? raw
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    payload.fullAnnotation[lang].sections = payload.fullAnnotation[lang].sections.map((section) => {
      const { hasTable, table, list, ...rest } = section;
      const cleanList = list.filter((item) => item.trim() !== '');
      const cleaned = { ...rest, list: cleanList };
      if (hasTable && table && (table.columns.length || table.rows.length)) {
        cleaned.table = table;
      }
      return cleaned;
    });
  });

  return payload;
}

function ProductDashboard() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { useFakeLoader } = useLoader();

  useEffect(() => useFakeLoader(), []);

  const [formData, setFormData] = useState(initialFormState);
  const [activeLang, setActiveLang] = useState('ka');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  const sections = formData.fullAnnotation[activeLang].sections;

  // ---- auth ----

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ---- simple field updates ----

  const updateTranslationField = (field, lang, value) => {
    setFormData((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  };

  const updateCharacteristic = (key, lang, value) => {
    setFormData((prev) => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [key]: { ...prev.characteristics[key], [lang]: value },
      },
    }));
  };

  const updateBrandName = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      brandName: { ...prev.brandName, [lang]: { ...prev.brandName[lang], [field]: value } },
    }));
  };

  const updateAnnotationField = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      fullAnnotation: {
        ...prev.fullAnnotation,
        [lang]: { ...prev.fullAnnotation[lang], [field]: value },
      },
    }));
  };

  // ---- images ----

  const updateImageUrl = (value) =>
    setFormData((prev) => ({ ...prev, image: { ...prev.image, url: value } }));

  const handleFileSelect = async (file) => {
    if (!file) return;
    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError(t('productDashboard.basicInfo.imageErrorType'));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(t('productDashboard.basicInfo.imageErrorSize'));
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      updateImageUrl(url);
    } catch (err) {
      setImageError(err.message || t('productDashboard.basicInfo.imageErrorUpload'));
    } finally {
      setUploading(false);
    }
  };

  // ---- sections (deep updates use a cloned draft, since nesting is heavy) ----

  const withSections = (updater) =>
    setFormData((prev) => {
      const draft = clone(prev);
      updater(draft.fullAnnotation[activeLang].sections);
      return draft;
    });

  const addSection = () => withSections((list) => list.push(emptySection()));
  const removeSection = (sIdx) => withSections((list) => list.splice(sIdx, 1));
  const moveSection = (sIdx, direction) =>
    withSections((list) => {
      const newIdx = sIdx + direction;
      if (newIdx < 0 || newIdx >= list.length) return;
      [list[sIdx], list[newIdx]] = [list[newIdx], list[sIdx]];
    });
  const updateSectionField = (sIdx, field, value) =>
    withSections((list) => {
      list[sIdx][field] = value;
    });

  const addListItem = (sIdx) => withSections((list) => list[sIdx].list.push(''));
  const updateListItem = (sIdx, iIdx, value) =>
    withSections((list) => {
      list[sIdx].list[iIdx] = value;
    });
  const removeListItem = (sIdx, iIdx) => withSections((list) => list[sIdx].list.splice(iIdx, 1));

  const toggleTable = (sIdx) =>
    withSections((list) => {
      list[sIdx].hasTable = !list[sIdx].hasTable;
    });

  const addTableColumn = (sIdx) =>
    withSections((list) => {
      const table = list[sIdx].table;
      table.columns.push('');
      table.rows.forEach((row) => row.push(''));
    });
  const updateTableColumn = (sIdx, cIdx, value) =>
    withSections((list) => {
      list[sIdx].table.columns[cIdx] = value;
    });
  const removeTableColumn = (sIdx, cIdx) =>
    withSections((list) => {
      const table = list[sIdx].table;
      table.columns.splice(cIdx, 1);
      table.rows.forEach((row) => row.splice(cIdx, 1));
    });

  const addTableRow = (sIdx) =>
    withSections((list) => {
      const table = list[sIdx].table;
      table.rows.push(table.columns.map(() => ''));
    });
  const updateTableCell = (sIdx, rIdx, cIdx, value) =>
    withSections((list) => {
      list[sIdx].table.rows[rIdx][cIdx] = value;
    });
  const removeTableRow = (sIdx, rIdx) =>
    withSections((list) => list[sIdx].table.rows.splice(rIdx, 1));

  const addTableFootnote = (sIdx) => withSections((list) => list[sIdx].table.footnotes.push(''));
  const updateTableFootnote = (sIdx, fIdx, value) =>
    withSections((list) => {
      list[sIdx].table.footnotes[fIdx] = value;
    });
  const removeTableFootnote = (sIdx, fIdx) =>
    withSections((list) => list[sIdx].table.footnotes.splice(fIdx, 1));

  // ---- submit ----

  const resetForm = () => {
    setFormData(initialFormState());
    setActiveLang('ka');
    setErrorMsg('');
    setSuccessMsg('');
    setUploading(false);
    setImageError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.handle.trim()) {
      setErrorMsg(t('productDashboard.alerts.handleRequired'));
      return;
    }
    if (!formData.title.ka.trim()) {
      setErrorMsg(t('productDashboard.alerts.titleDefaultLangRequired'));
      return;
    }
    if (uploading) {
      setErrorMsg(t('productDashboard.alerts.waitForUpload'));
      return;
    }

    const payload = buildPayload(formData);

    try {
      setSubmitting(true);
      await createProduct(payload);
      setSuccessMsg(t('productDashboard.alerts.saveSuccess'));
      resetForm();
    } catch (err) {
      setErrorMsg(err.message || t('productDashboard.alerts.saveError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard__inner">
        <div className="admin-dashboard__topbar">
          <div className="admin-dashboard__eyebrow">
            <span className="line" />
            <p>{t('productDashboard.eyebrow')}</p>
          </div>
          <button
            type="button"
            className="admin-dashboard__logout"
            onClick={handleLogout}
          >
            {t('productDashboard.actions.logout')}
          </button>
        </div>

        <div className="admin-dashboard__header">
          <h1 className="admin-dashboard__title">{t('productDashboard.title')}</h1>
          <p className="admin-dashboard__intro">{t('productDashboard.intro')}</p>
        </div>

        {errorMsg && (
          <div
            className="admin-dashboard__alert admin-dashboard__alert--error"
            role="alert"
          >
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div
            className="admin-dashboard__alert admin-dashboard__alert--success"
            role="status"
          >
            {successMsg}
          </div>
        )}

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <fieldset className="admin-form__section">
            <legend>{t('productDashboard.basicInfo.legend')}</legend>

            <div className="admin-form__field">
              <label htmlFor="handle">{t('productDashboard.basicInfo.handleLabel')}</label>
              <input
                id="handle"
                type="text"
                value={formData.handle}
                placeholder={t('productDashboard.basicInfo.handlePlaceholder')}
                onChange={(e) => setFormData((prev) => ({ ...prev, handle: e.target.value }))}
                required
              />
              <p className="admin-form__hint">{t('productDashboard.basicInfo.handleHint')}</p>
            </div>

            <div className="admin-form__field">
              <label id="image-label">{t('productDashboard.basicInfo.imageLabel')}</label>
              <div className="admin-form__image-row">
                <div className="admin-form__image-row-top">
                  <label
                    htmlFor={`image-upload-${formData.image.id}`}
                    className={`admin-form__file-label ${uploading ? 'is-uploading' : ''}`}
                  >
                    {uploading
                      ? t('productDashboard.basicInfo.imageUploading')
                      : formData.image.url
                        ? t('productDashboard.basicInfo.imageReplace')
                        : t('productDashboard.basicInfo.imageChoose')}
                  </label>
                  <input
                    id={`image-upload-${formData.image.id}`}
                    type="file"
                    accept="image/*"
                    className="admin-form__file-input"
                    aria-labelledby="image-label"
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    disabled={uploading}
                  />

                  {formData.image.url && (
                    <img
                      className="admin-form__image-preview"
                      src={formData.image.url}
                      alt=""
                      onError={(e) => {
                        e.target.style.visibility = 'hidden';
                      }}
                    />
                  )}

                  <input
                    type="text"
                    className="admin-form__image-url"
                    value={formData.image.url}
                    placeholder={t('productDashboard.basicInfo.imageUrlPlaceholder')}
                    aria-label={t('productDashboard.basicInfo.imageUrlAriaLabel')}
                    onChange={(e) => updateImageUrl(e.target.value)}
                  />
                </div>

                {imageError && (
                  <p
                    className="admin-form__field-error"
                    role="alert"
                  >
                    {imageError}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="admin-tabs">
            {LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`admin-tabs__tab ${activeLang === lang ? 'is-active' : ''}`}
                onClick={() => setActiveLang(lang)}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          <fieldset className="admin-form__section">
            <legend>
              {t('productDashboard.titleBrand.legend')} — {LANG_LABELS[activeLang]}
            </legend>
            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label htmlFor={`title-${activeLang}`}>
                  {t('productDashboard.titleBrand.titleLabel')}
                </label>
                <input
                  id={`title-${activeLang}`}
                  type="text"
                  value={formData.title[activeLang]}
                  onChange={(e) => updateTranslationField('title', activeLang, e.target.value)}
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor={`brand-primary-${activeLang}`}>
                  {t('productDashboard.titleBrand.brandPrimaryLabel')}
                </label>
                <input
                  id={`brand-primary-${activeLang}`}
                  type="text"
                  value={formData.brandName[activeLang].primary}
                  onChange={(e) => updateBrandName(activeLang, 'primary', e.target.value)}
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor={`brand-secondary-${activeLang}`}>
                  {t('productDashboard.titleBrand.brandSecondaryLabel')}
                </label>
                <input
                  id={`brand-secondary-${activeLang}`}
                  type="text"
                  value={formData.brandName[activeLang].secondary}
                  onChange={(e) => updateBrandName(activeLang, 'secondary', e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="admin-form__section">
            <legend>
              {t('productDashboard.characteristics.legend')} — {LANG_LABELS[activeLang]}
            </legend>
            <div className="admin-form__grid">
              {CHARACTERISTIC_KEYS.map((key) => (
                <div
                  className="admin-form__field"
                  key={key}
                >
                  <label htmlFor={`${key}-${activeLang}`}>
                    {t(`productDashboard.characteristics.${key}`)}
                  </label>
                  <input
                    id={`${key}-${activeLang}`}
                    type="text"
                    value={formData.characteristics[key][activeLang]}
                    onChange={(e) => updateCharacteristic(key, activeLang, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="admin-form__section">
            <legend>
              {t('productDashboard.shortDescription.legend')} — {LANG_LABELS[activeLang]}
            </legend>
            <div className="admin-form__field">
              <label
                htmlFor={`short-description-${activeLang}`}
                className="admin-form__visually-hidden-label"
              >
                {t('productDashboard.shortDescription.legend')}
              </label>
              <textarea
                id={`short-description-${activeLang}`}
                rows={3}
                value={formData.shortDescription[activeLang]}
                onChange={(e) =>
                  updateTranslationField('shortDescription', activeLang, e.target.value)
                }
              />
            </div>
          </fieldset>

          <fieldset className="admin-form__section">
            <legend>
              {t('productDashboard.fullAnnotation.legend')} — {LANG_LABELS[activeLang]}
            </legend>

            <div className="admin-form__grid">
              <div className="admin-form__field">
                <label htmlFor={`category-${activeLang}`}>
                  {t('productDashboard.fullAnnotation.categoryLabel')}
                </label>
                <input
                  id={`category-${activeLang}`}
                  type="text"
                  value={formData.fullAnnotation[activeLang].category}
                  onChange={(e) => updateAnnotationField(activeLang, 'category', e.target.value)}
                />
              </div>
              <div className="admin-form__field">
                <label htmlFor={`form-${activeLang}`}>
                  {t('productDashboard.fullAnnotation.formLabel')}
                </label>
                <input
                  id={`form-${activeLang}`}
                  type="text"
                  value={formData.fullAnnotation[activeLang].form}
                  onChange={(e) => updateAnnotationField(activeLang, 'form', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form__field">
              <label htmlFor={`lead-${activeLang}`}>
                {t('productDashboard.fullAnnotation.leadLabel')}
              </label>
              <textarea
                id={`lead-${activeLang}`}
                rows={2}
                value={formData.fullAnnotation[activeLang].lead}
                onChange={(e) => updateAnnotationField(activeLang, 'lead', e.target.value)}
              />
            </div>

            <div className="admin-form__sections">
              <h2 className="admin-form__sections-title">
                {t('productDashboard.fullAnnotation.sectionsTitle')}
              </h2>

              {sections.map((section, sIdx) => (
                <div
                  className="admin-section-card"
                  key={sIdx}
                >
                  <div className="admin-section-card__head">
                    <span className="admin-section-card__index">
                      {String(sIdx + 1).padStart(2, '0')}
                    </span>
                    <div className="admin-section-card__actions">
                      <button
                        type="button"
                        aria-label={t('productDashboard.fullAnnotation.moveUp', { n: sIdx + 1 })}
                        onClick={() => moveSection(sIdx, -1)}
                        disabled={sIdx === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        aria-label={t('productDashboard.fullAnnotation.moveDown', { n: sIdx + 1 })}
                        onClick={() => moveSection(sIdx, 1)}
                        disabled={sIdx === sections.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="admin-form__remove-btn"
                        onClick={() => removeSection(sIdx)}
                      >
                        {t('productDashboard.fullAnnotation.remove')}
                      </button>
                    </div>
                  </div>

                  <div className="admin-form__field">
                    <label htmlFor={`section-title-${sIdx}`}>
                      {t('productDashboard.fullAnnotation.sectionTitleLabel')}
                    </label>
                    <input
                      id={`section-title-${sIdx}`}
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSectionField(sIdx, 'title', e.target.value)}
                    />
                  </div>

                  <div className="admin-form__field">
                    <label htmlFor={`section-text-${sIdx}`}>
                      {t('productDashboard.fullAnnotation.textLabel')}
                    </label>
                    <textarea
                      id={`section-text-${sIdx}`}
                      rows={3}
                      value={section.text}
                      placeholder={t('productDashboard.fullAnnotation.textPlaceholder')}
                      onChange={(e) => updateSectionField(sIdx, 'text', e.target.value)}
                    />
                  </div>

                  <div className="admin-form__field">
                    <label id={`section-list-label-${sIdx}`}>
                      {t('productDashboard.fullAnnotation.listItemsLabel')}
                    </label>
                    {section.list.map((item, iIdx) => (
                      <div
                        className="admin-form__list-row"
                        key={iIdx}
                      >
                        <input
                          type="text"
                          value={item}
                          aria-label={t('productDashboard.fullAnnotation.listItemAriaLabel', {
                            n: iIdx + 1,
                          })}
                          onChange={(e) => updateListItem(sIdx, iIdx, e.target.value)}
                        />
                        <button
                          type="button"
                          className="admin-form__remove-btn"
                          onClick={() => removeListItem(sIdx, iIdx)}
                        >
                          {t('productDashboard.fullAnnotation.remove')}
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="admin-form__add-btn"
                      onClick={() => addListItem(sIdx)}
                    >
                      {t('productDashboard.fullAnnotation.addListItem')}
                    </button>
                  </div>

                  <label className="admin-form__checkbox">
                    <input
                      type="checkbox"
                      checked={section.hasTable}
                      onChange={() => toggleTable(sIdx)}
                    />
                    {t('productDashboard.fullAnnotation.includeTable')}
                  </label>

                  {section.hasTable && (
                    <div className="admin-table-editor">
                      <div className="admin-form__field">
                        <label id={`table-columns-label-${sIdx}`}>
                          {t('productDashboard.fullAnnotation.columnsLabel')}
                        </label>
                        {section.table.columns.map((col, cIdx) => (
                          <div
                            className="admin-form__list-row"
                            key={cIdx}
                          >
                            <input
                              type="text"
                              value={col}
                              aria-label={t('productDashboard.fullAnnotation.columnAriaLabel', {
                                n: cIdx + 1,
                              })}
                              onChange={(e) => updateTableColumn(sIdx, cIdx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="admin-form__remove-btn"
                              onClick={() => removeTableColumn(sIdx, cIdx)}
                            >
                              {t('productDashboard.fullAnnotation.remove')}
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="admin-form__add-btn"
                          onClick={() => addTableColumn(sIdx)}
                        >
                          {t('productDashboard.fullAnnotation.addColumn')}
                        </button>
                      </div>

                      <div className="admin-form__field">
                        <label id={`table-rows-label-${sIdx}`}>
                          {t('productDashboard.fullAnnotation.rowsLabel')}
                        </label>
                        {section.table.rows.map((row, rIdx) => (
                          <div
                            className="admin-table-editor__row"
                            key={rIdx}
                          >
                            {row.map((cell, cIdx) => {
                              const columnFallback = t(
                                'productDashboard.fullAnnotation.columnAriaLabel',
                                {
                                  n: cIdx + 1,
                                }
                              );
                              const columnName = section.table.columns[cIdx] || columnFallback;
                              return (
                                <input
                                  key={cIdx}
                                  type="text"
                                  value={cell}
                                  placeholder={columnName}
                                  aria-label={t('productDashboard.fullAnnotation.rowAriaLabel', {
                                    n: rIdx + 1,
                                    column: columnName,
                                  })}
                                  onChange={(e) =>
                                    updateTableCell(sIdx, rIdx, cIdx, e.target.value)
                                  }
                                />
                              );
                            })}
                            <button
                              type="button"
                              className="admin-form__remove-btn"
                              onClick={() => removeTableRow(sIdx, rIdx)}
                            >
                              {t('productDashboard.fullAnnotation.remove')}
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="admin-form__add-btn"
                          onClick={() => addTableRow(sIdx)}
                          disabled={section.table.columns.length === 0}
                        >
                          {t('productDashboard.fullAnnotation.addRow')}
                        </button>
                      </div>

                      <div className="admin-form__field">
                        <label id={`table-footnotes-label-${sIdx}`}>
                          {t('productDashboard.fullAnnotation.footnotesLabel')}
                        </label>
                        {section.table.footnotes.map((note, fIdx) => (
                          <div
                            className="admin-form__list-row"
                            key={fIdx}
                          >
                            <input
                              type="text"
                              value={note}
                              aria-label={t('productDashboard.fullAnnotation.footnoteAriaLabel', {
                                n: fIdx + 1,
                              })}
                              onChange={(e) => updateTableFootnote(sIdx, fIdx, e.target.value)}
                            />
                            <button
                              type="button"
                              className="admin-form__remove-btn"
                              onClick={() => removeTableFootnote(sIdx, fIdx)}
                            >
                              {t('productDashboard.fullAnnotation.remove')}
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="admin-form__add-btn"
                          onClick={() => addTableFootnote(sIdx)}
                        >
                          {t('productDashboard.fullAnnotation.addFootnote')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="admin-form__add-btn admin-form__add-btn--primary"
                onClick={addSection}
              >
                {t('productDashboard.fullAnnotation.addSection')}
              </button>
            </div>
          </fieldset>

          <div className="admin-form__submit-row">
            <button
              type="button"
              className="admin-form__btn admin-form__btn--ghost"
              onClick={resetForm}
            >
              {t('productDashboard.actions.resetForm')}
            </button>
            <button
              type="submit"
              className="admin-form__btn admin-form__btn--primary"
              disabled={submitting}
            >
              {submitting
                ? t('productDashboard.actions.saving')
                : t('productDashboard.actions.save')}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ProductDashboard;