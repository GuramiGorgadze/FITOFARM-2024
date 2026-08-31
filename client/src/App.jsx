import { useState } from 'react';
import { Navbar, Footer, Main } from './layouts';
import { Routes, Route } from 'react-router-dom';
import { Home, About, Contact, Products, ProductSingle, PrivacyPolicy, Terms } from './routes';
import { ScrollToTopButton, LoadingScreen } from './components';
import { Toaster } from 'react-hot-toast';
import './styles/style.scss';
import useDocumentTitle from './hooks/useDocumentTitle';
import useMetaDescription from './hooks/useMetaDescription';
import useOrganizationSchema from './hooks/useOrganizationSchema';
import useScrollTop from './hooks/useScrollTop';
import useAppScale from './hooks/useAppScale';

function App() {
  useDocumentTitle();
  useMetaDescription();
  useOrganizationSchema();
  useScrollTop();
  useAppScale();

  return (
    <>
      <Toaster
        position="bottom-center"
        containerStyle={{
          bottom: '60px',
        }}
        toastOptions={{
          duration: 3000,
          className: 'custom-toast',
          iconTheme: {
            primary: '#2f8a4f',
          },
        }}
      />
      <Navbar />
      <Main>
        <ScrollToTopButton />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/about"
            element={<About />}
          />
          <Route
            path="/contact"
            element={<Contact />}
          />
          <Route
            path="/products"
            element={<Products />}
          />
          <Route
            path="/products/:id"
            element={<ProductSingle />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicy />}
          />
          <Route
            path="/terms"
            element={<Terms />}
          />
        </Routes>
      </Main>
      <Footer />
      <LoadingScreen />
    </>
  );
}

export default App;
