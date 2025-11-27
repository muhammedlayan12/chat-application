import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const fetchMessages = async (user1: string, user2: string) => {
  const response = await axios.get(`${API_URL}/messages`, {
    params: { user1, user2 }
  });
  return response.data;
};
