import axios from 'axios';

export const contact = async (data) => {
  try {
    const response = await axios.post('http://localhost:3000/api/users/contact', data, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.err || 'Something went wrong';
    throw new Error(message);
  }
};
