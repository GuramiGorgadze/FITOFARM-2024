import { useEffect, useState } from 'react';
import { ProductCard, Disclaimer } from '../components';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { getProducts, getProductRatingSummaries } from '../api/api';

const Products = () => {
  const { t } = useTranslation();
  const { useDataLoader } = useLoader();

  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});

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

    getProductRatingSummaries()
      .then(({ data }) => setRatings(data || {}))
      .catch(() => {});
  }, []);

  return (
    <>
      {' '}
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
              rating={ratings[product.handle]}
            />
          ))}
        </div>
      </section>
      <Disclaimer />
    </>
  );
};

export default Products;



