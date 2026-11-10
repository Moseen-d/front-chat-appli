import axios from "axios";

// Dynamically use VITE_BACKEND_URL (or VITE_API_URL) in production / Vercel, 
// fallback to Render backend if in PROD, or localhost:8080 in local dev
export const baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://chat-app-backend-wigo.onrender.com"
    : "http://localhost:8080");

export const httpClient = axios.create({
  baseURL: baseURL,
});
