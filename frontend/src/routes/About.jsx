import React from 'react';
import { useLoader } from '../context/LoaderContext';
import { useEffect } from 'react';

function about() {
  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);
  return <div>about</div>;
}

export default about;
