import { useEffect } from 'react';

function injectJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function useOrganizationSchema() {
  useEffect(() => {
    injectJsonLd('schema-org', {
      '@context': 'https://schema.org',
      '@type': 'Pharmacy',
      name: 'FITOFARM',
      url: 'https://fitofarm2024.ge',
      telephone: '+995 599 14 21 18',
      email: 'info@fitofarm2024.ge',
    });
  }, []);
}

export default useOrganizationSchema;
