import { useLoader } from '../context/LoaderContext';
import { useEffect } from 'react';
import { Disclaimer } from '../components';

function Products() {
  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  return (
    <>
      <div>Products</div>;
      <Disclaimer />
    </>
  );
}

export default Products;
