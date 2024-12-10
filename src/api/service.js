import axios from 'axios';

const API_URL = 'https://du-mock-checkout-7d42d0a76fbf.herokuapp.com/';
const AUTH_HEADER = {
  Authorization: 'Bearer C4D5C577E9914C4B9C9BF46DF9914A28'
};

export const apiRequest = async (method, url, data = null, params = null) => {
  try {
    const response = await axios({
      method,
      url: `${API_URL}${url}`,
      headers: AUTH_HEADER,
      data,
      params
    });
    return response.data;
  } catch (error) {
    console.error(
      `API Request Error [${method}] ${url}:`,
      error.response || error.message
    );
    throw error.response?.data || error.message || 'An error occurred';
  }
};
