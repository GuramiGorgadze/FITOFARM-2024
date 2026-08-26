import React from 'react';
import { useLoader } from '../context/LoaderContext';

function Loading() {
  const { loading } = useLoader();

  return (
    <div className={`loadingScreen ${loading ? 'fade-in' : 'fade-out'}`}>
      <span className="loader"></span>
    </div>
  );
}

export default Loading;
