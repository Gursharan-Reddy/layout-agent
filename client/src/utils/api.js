import axios from "axios";

// Fallback dynamically handles both local sandbox testing and production deployment
const SEED_URL = import.meta.env.VITE_API_URL || "https://layout-agent-backend-zvfk.onrender.com/api";

const API_CLIENT = axios.create({
  baseURL: SEED_URL,
  headers: { "Content-Type": "application/json" }
});

export const sendAgentCommand = async (payload) => {
  const { data } = await API_CLIENT.post("/chat", payload);
  return data;
};