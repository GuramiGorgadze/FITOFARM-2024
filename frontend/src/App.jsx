import { useState } from 'react';
import { Navbar, Footer, Main } from './layouts';
import { Routes, Route } from 'react-router-dom';
import { Home, About, Contact, Products, ProductSingle } from './routes';
import { ScrollToTopButton, Disclaimer } from './components';
import { Toaster } from 'react-hot-toast';
import './styles/style.scss';
import useDocumentTitle from './hooks/useDocumentTitle';
import useScrollTop from './hooks/useScrollTop';
import useAppScale from './hooks/useAppScale';

function App() {
  useDocumentTitle();
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
            primary: '#1a5e1e',
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
        </Routes>
      </Main>
      <Disclaimer />
      <Footer />
    </>
  );
}

export default App;
