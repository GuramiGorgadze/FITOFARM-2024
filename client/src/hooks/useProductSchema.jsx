import { useEffect } from 'react';

const SCHEMA_ID = 'schema-product';

function setJsonLd(data) {
  let script = document.getElementById(SCHEMA_ID);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCHEMA_ID;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function removeJsonLd() {
  document.getElementById(SCHEMA_ID)?.remove();
}

function useProductSchema(product, lang) {
  useEffect(() => {
    const name = product?.title?.[lang];
    if (!name) return;

    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      description: product.shortDescription?.[lang],
      image: product.images,
      brand: product.brandName?.[lang]?.primary
        ? { '@type': 'Brand', name: product.brandName[lang].primary }
        : undefined,
    });

    return () => removeJsonLd();
  }, [product, lang]);
}

export default useProductSchema;
