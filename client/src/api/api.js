import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const contact = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/contact`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || 'Something went wrong';
    throw new Error(message);
  }
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error fetching products');
  }
};

export const getProductByHandle = async (handle) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products/${handle}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error fetching product');
  }
};

export const createProduct = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/products`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.response?.data?.err || 'Error creating product'
    );
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${BASE_URL}/api/uploads`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error uploading image');
  }
};

export const getRatings = async ({ productHandle, page = 1, limit = 6 } = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/ratings`, {
      params: { product: productHandle || undefined, page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error fetching ratings');
  }
};

export const getRatingSummary = async (productHandle) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/ratings/summary`, {
      params: { product: productHandle || undefined },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error fetching rating summary');
  }
};

export const getProductRatingSummaries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/ratings/summaries`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error fetching rating summaries');
  }
};

export const createRating = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/ratings`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error submitting rating');
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Invalid email or password');
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error logging out');
  }
};

export const checkAuth = async () => {
  const response = await axios.get(`/api/auth/me`, {
    withCredentials: true,
  });
  return response.data;
};
