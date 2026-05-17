import axios from 'axios';

const API_CLIENT = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' }
});

export const sendAgentCommand = async (payload) => {
  const { data } = await API_CLIENT.post('/chat', payload);
  return data;
};