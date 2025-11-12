// src/services/api.ts
import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080/api",
  withCredentials: true,
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (cfg.headers instanceof AxiosHeaders) {
      cfg.headers.set("Authorization", `Bearer ${token}`);
    } else {
      const h = (cfg.headers ?? {}) as any;
      h["Authorization"] = `Bearer ${token}`;
      cfg.headers = h;
    }
  }
  const method = (cfg.method ?? "get").toLowerCase();
  if (method === "get") {
    if (cfg.headers instanceof AxiosHeaders) {
      cfg.headers.set("Cache-Control", "no-store");
      cfg.headers.set("Pragma", "no-cache");
    } else {
      const h = (cfg.headers ?? {}) as any;
      h["Cache-Control"] = "no-store";
      h["Pragma"] = "no-cache";
      cfg.headers = h;
    }
    cfg.params = { ...(cfg.params as any), _t: Date.now() };
  }
  return cfg;
});

export default api;
