// src/services/authService.js
import api from "./api.ts";

/**
 * Đăng nhập
 * Backend trả: { token, next, role }
 */
const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

/**
 * Đăng ký
 */
const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};

/**
 * Lấy thông tin user hiện tại
 */
const me = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

/**
 * Đăng xuất
 */
const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (_) {}

  try {
    localStorage.removeItem("auth_user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    sessionStorage.clear();

    if (window.caches) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } finally {
    window.location.replace("/login");
  }
};

/**
 * Cập nhật hồ sơ
 */
const updateProfile = async (payload) => {
  const { data } = await api.put("/auth/profile", payload);
  return data;
};

/**
 * Đổi mật khẩu (khi đã đăng nhập)
 */
const changePassword = async (oldPassword, newPassword) => {
  const { data } = await api.post("/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

/**
 * Upload avatar
 */
const uploadAvatar = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post("/files/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

/**
 * QUÊN MẬT KHẨU – bước 1: kiểm tra email/số ĐT
 * Backend: POST /auth/forgot/check
 * Body cần: { identifier: "..." }
 */
const forgotCheck = async (emailOrPhone) => {
  const { data } = await api.post("/auth/forgot/check", {
    identifier: emailOrPhone,
  });
  return data;
};

/**
 * QUÊN MẬT KHẨU – bước 2: đặt mật khẩu mới
 * Backend: POST /auth/forgot/reset
 * Body cần: { identifier: "...", newPassword: "..." }
 */
const forgotReset = async (emailOrPhone, newPassword, confirmPassword) => {
  const { data } = await api.post("/auth/forgot/reset", {
    identifier: emailOrPhone,
    newPassword,
    confirmPassword, // 🔥 FE gửi đúng key mà BE yêu cầu
  });
  return data;
};

export default {
  login,
  register,
  me,
  logout,
  updateProfile,
  changePassword,
  uploadAvatar,
  forgotCheck,
  forgotReset,
};
