import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import * as api from '../api/api';
import { useLoader } from '../context/LoaderContext';

function Contact() {
  const { t } = useTranslation();

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleRef = useRef(null);
  const titleText = t('contact.title');

  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    const BASELINE = 46;

    const fit = () => {
      const availableWidth = titleEl.parentElement?.clientWidth;
      if (!availableWidth) return;

      titleEl.style.fontSize = `${BASELINE}px`;
      const naturalWidth = titleEl.scrollWidth;
      if (!naturalWidth) return;

      titleEl.style.fontSize = `${(BASELINE * availableWidth) / naturalWidth}px`;
    };

    fit();

    if (document.fonts?.ready) {
      document.fonts.ready.then(fit);
    }

    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [titleText]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, email, subject, message } = formData;

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error(t('contact.toast.validationError'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error(t('contact.toast.emailError'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading(t('contact.toast.loading'), { duration: 5000 });

    try {
      await api.contact(formData);
      toast.success(t('contact.toast.success'), { id: toastId });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || t('contact.toast.error'), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact">
      <div className="contact__intro">
        <div className="contact__subtext">
          <span className="line"></span>
          <p>{t('nav.contact')}</p>
        </div>

        <h2
          className="contact__title"
          ref={titleRef}
        >
          {titleText}
        </h2>
        <p className="contact__text">{t('contact.text')}</p>
      </div>

      <div className="contact__card">
        <form
          className="contact__form"
          onSubmit={handleSubmit}
        >
          <div className="contact__field">
            <label
              className="contact__label"
              htmlFor="name"
            >
              {t('contact.name')}
            </label>
            <input
              className="contact__input"
              id="name"
              name="name"
              type="text"
              placeholder={t('contact.name')}
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="contact__field">
            <label
              className="contact__label"
              htmlFor="email"
            >
              {t('contact.email')}
            </label>
            <input
              className="contact__input"
              id="email"
              name="email"
              type="text"
              placeholder={t('contact.email')}
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="contact__field">
            <label
              className="contact__label"
              htmlFor="subject"
            >
              {t('contact.topic')}
            </label>
            <input
              className="contact__input"
              id="subject"
              name="subject"
              type="text"
              placeholder={t('contact.topic')}
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="contact__field">
            <label
              className="contact__label"
              htmlFor="message"
            >
              {t('contact.message')}
            </label>
            <textarea
              className="contact__textarea"
              id="message"
              name="message"
              placeholder={t('contact.message')}
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button
            className="contact__button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t('contact.sending') : t('contact.button')}
          </button>

          <p className="contact__warning">{t('contact.warning')}</p>
        </form>

        <div
          className="contact__card-bg"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
}

export default Contact;
