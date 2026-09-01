import axios from 'axios';

export const contact = async (data) => {
  try {
    const response = await axios.post('/api/users/contact', data, {
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
    const response = await axios.get(`/api/products`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error fetching products');
  }
};

export const getProductByHandle = async (handle) => {
  try {
    const response = await axios.get(`/api/products/${handle}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error fetching product');
  }
};

export const createProduct = async (data) => {
  try {
    const response = await axios.post(`/api/products`, data, {
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

    const response = await axios.post(`/api/uploads`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.err || 'Error uploading image');
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`/api/auth/login`, data, {
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
    const response = await axios.post(
      `/api/auth/logout`,
      {},
      { withCredentials: true }
    );
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
