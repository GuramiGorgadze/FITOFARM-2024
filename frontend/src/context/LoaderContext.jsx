import { createContext, useState, useContext } from 'react';

export const LoaderContext = createContext({});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const loadingDelay = 300;

  // hook: useDataLoader (for routes that fetch data)
  const useDataLoader = async (fetchReq) => {
    setLoading(true);

    try {
      const delayPromise = new Promise((resolve) => setTimeout(resolve, loadingDelay));

      const dataPromise = fetchReq();

      const [response] = await Promise.all([dataPromise, delayPromise]);

      return response;
    } finally {
      setLoading(false);
    }
  };

  // hook: useFakeLoader (for routes that simulate loading without fetch)
  const useFakeLoader = () => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      clearTimeout(timer);
    }, loadingDelay);
  };

  return (
    <LoaderContext.Provider value={{ loading, useDataLoader, useFakeLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
