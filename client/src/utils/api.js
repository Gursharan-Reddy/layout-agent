import axios from "axios";

// Removed the trailing /api since the backend routes directly to /chat
const SEED_URL = import.meta.env.VITE_API_URL || "https://layout-agent-backend-zvfk.onrender.com";

const API_CLIENT = axios.create({
  baseURL: SEED_URL,
  headers: { "Content-Type": "application/json" }
});

export const sendAgentCommand = async (payload) => {
  const { data } = await API_CLIENT.post("/chat", payload);
  return data;
};