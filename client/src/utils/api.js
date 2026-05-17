import axios from "axios";

// Environment variable with a fallback to your live production Render URL
const SEED_URL = import.meta.env.VITE_API_URL || "https://layout-agent-backend-zvfk.onrender.com";

const API_CLIENT = axios.create({
  baseURL: SEED_URL,
  headers: { "Content-Type": "application/json" }
});

export const sendAgentCommand = async (payload) => {
  // Axios will cleanly merge the baseURL and this path into:
  // https://layout-agent-backend-zvfk.onrender.com/chat
  const { data } = await API_CLIENT.post("/chat", payload);
  return data;
};