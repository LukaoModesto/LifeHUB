import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_URL;

if (!apiBaseUrl) {
  throw new Error("VITE_API_URL não foi configurada.");
}

export const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lifehub_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});