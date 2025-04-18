import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

export const API = axios.create({
  baseURL: `${API_BASE}/api`, // ✅ Use your PC's local IP here!
});
