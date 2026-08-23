import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case '/':
        document.title = 'FitoFarm-2024 - A Natural Path to Well-Being';
        break;
      case '/products':
        document.title = 'Products - FitoFarm-2024';
        break;
      case '/products/:id':
        document.title = 'Products - FitoFarm-2024';
        break;
      case '/about':
        document.title = 'About - FitoFarm-2024';
        break;
      case '/contact':
        document.title = 'Contact - FitoFarm-2024';
        break;
      default:
        document.title = 'FitoFarm-2024 - A Natural Path to Well-Being';
    }
  }, [pathname]);
};

export default useDocumentTitle;
