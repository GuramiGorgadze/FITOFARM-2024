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

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Error fetching product');
  }
};
