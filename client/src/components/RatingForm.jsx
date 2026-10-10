import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import * as api from '../api/api';
import StarInput from './StarInput';

const NAME_MAX = 60;
const COMMENT_MAX = 1000;
const COMMENT_MIN = 3;

// Rating form (stars + name + comment).
// Pass `productHandle` to rate a product, omit it to rate the company.
function RatingForm({ productHandle, onCreated }) {
  const { t } = useTranslation();
  const uid = useId();

  const [formData, setFormData] = useState({ name: '', stars: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const { name, stars, comment } = formData;

    if (!stars) {
      toast.error(t('ratings.toast.starsError'));
      return false;
    }
    if (!name.trim()) {
      toast.error(t('ratings.toast.nameError'));
      return false;
    }
    if (comment.trim().length < COMMENT_MIN) {
      toast.error(t('ratings.toast.commentError'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    const toastId = toast.loading(t('ratings.toast.loading'), { duration: 5000 });

    try {
      await api.createRating({
        name: formData.name.trim(),
        stars: formData.stars,
        comment: formData.comment.trim(),
        productHandle: productHandle || undefined,
      });
      toast.success(t('ratings.toast.success'), { id: toastId });
      setFormData({ name: '', stars: 0, comment: '' });
      onCreated?.();
    } catch (err) {
      toast.error(err.message || t('ratings.toast.error'), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="rating-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <StarInput
        value={formData.stars}
        onChange={(stars) => setFormData((prev) => ({ ...prev, stars }))}
        disabled={isSubmitting}
      />

      <div className="rating-form__field">
        <label
          className="rating-form__label"
          htmlFor={`${uid}-name`}
        >
          {t('ratings.form.name')}
        </label>
        <input
          className="rating-form__input"
          id={`${uid}-name`}
          name="name"
          type="text"
          maxLength={NAME_MAX}
          placeholder={t('ratings.form.name')}
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
        />
      </div>

      <div className="rating-form__field">
        <label
          className="rating-form__label"
          htmlFor={`${uid}-comment`}
        >
          {t('ratings.form.comment')}
        </label>
        <textarea
          className="rating-form__textarea"
          id={`${uid}-comment`}
          name="comment"
          maxLength={COMMENT_MAX}
          placeholder={t('ratings.form.commentPlaceholder')}
          value={formData.comment}
          onChange={handleChange}
        />
        <span className="rating-form__counter">
          {formData.comment.length} / {COMMENT_MAX}
        </span>
      </div>

      <button
        className="rating-form__button"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('ratings.form.sending') : t('ratings.form.submit')}
      </button>
    </form>
  );
}

export default RatingForm;
