import { useEffect, useState } from 'react';
import { ProductCard } from '../components';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { getProducts } from '../api/api';

const Products = () => {
  const { t } = useTranslation();
  const { useDataLoader } = useLoader();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsData = async () => {
      const data = await useDataLoader(getProducts);

      if (data?.data) {
        setProducts(data.data);
      } else if (data.err) {
        console.log(data.err);
      }
    };

    fetchProductsData();
  }, []);

  return (
    <section className="product-page">
      <div className="hero">
        <div className="hero__title">
          <p className="hero__title-text">{t('products.title')}</p>
        </div>
        <div className="hero__divider"></div>
      </div>

      <div className="product-page__grid">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

export default Products;
