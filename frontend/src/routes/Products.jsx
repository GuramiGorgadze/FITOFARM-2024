import React from 'react';
import { useLoader } from '../context/LoaderContext';
import { useEffect } from 'react';

function Products() {
  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);
  return <div>Products</div>;
}

export default Products;
