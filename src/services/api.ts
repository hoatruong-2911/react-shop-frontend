// src/services/api.ts
import axios, { AxiosHeaders } from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:8080/api",
  withCredentials: true,
});

// ===== REQUEST INTERCEPTOR =====
api.interceptors.request.use((cfg) => {
  // Lấy token từ localStorage (nhớ lưu đúng key "token")
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

  // Chống cache cho GET
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

// ===== RESPONSE INTERCEPTOR (XỬ LÝ 401 & CACHE) =====
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    // Nếu server báo 401 → coi như hết phiên đăng nhập
    if (status === 401) {
      try {
        // Xoá toàn bộ thông tin đăng nhập lưu local
        localStorage.removeItem("auth_user");
        localStorage.removeItem("role");
        localStorage.removeItem("token");      // token mà request đang dùng
        sessionStorage.clear();

        // Xoá cache PWA (nếu có)
        if (window.caches) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } finally {
        // Chuyển về trang login, xoá state React trong bộ nhớ
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }

    // Để component phía trên còn bắt được lỗi hiển thị toast, v.v.
    return Promise.reject(error);
  }
);

export default api;
