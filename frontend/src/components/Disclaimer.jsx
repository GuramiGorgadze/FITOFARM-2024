import React from 'react';
import { useTranslation } from 'react-i18next';

function disclaimer() {
  const { t } = useTranslation();
  return (
    <div className="disclaimer">
      <i class="bi bi-exclamation-circle-fill"></i>

      <p className="text">{t('disclaimer')}</p>
    </div>
  );
}

export default disclaimer;
