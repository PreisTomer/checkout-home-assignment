import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;
const AUTH_HEADER = {
  Authorization: `Bearer ${process.env.VUE_APP_AUTH_TOKEN}`
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
