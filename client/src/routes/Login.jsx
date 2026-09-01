import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLoader } from '../context/LoaderContext';

const loginSchema = yup
  .object({
    email: yup.string().trim().email('Enter a valid email address').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })
  .required();

function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { useFakeLoader } = useLoader();

  useEffect(() => useFakeLoader(), []);

  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const redirectTo = location.state?.from?.pathname || '/admin';

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message || t('login.errors.invalidCredentials'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="admin-login">
      <div className="admin-login__inner">
        <h1 className="admin-login__title">{t('login.title')}</h1>

        {serverError && (
          <div
            className="admin-dashboard__alert admin-dashboard__alert--error"
            role="alert"
          >
            {serverError}
          </div>
        )}

        <form
          className="admin-login__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="admin-form__field">
            <label htmlFor="email">{t('login.emailLabel')}</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              {...register('email')}
            />
            {errors.email && (
              <p
                className="admin-form__field-error"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="admin-form__field">
            <label htmlFor="password">{t('login.passwordLabel')}</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p
                className="admin-form__field-error"
                role="alert"
              >
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="admin-form__btn admin-form__btn--primary"
            disabled={submitting}
          >
            {submitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
