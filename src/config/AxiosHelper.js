import axios from "axios";

// Dynamically use VITE_BACKEND_URL in production / Vercel, fallback to Render backend if PROD, or localhost:8080 in dev
export const baseURL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD
    ? "https://chat-app-backend-wigo.onrender.com"
    : "http://localhost:8080");

export const httpClient = axios.create({
  baseURL: baseURL,
});
