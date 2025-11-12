// src/services/authService.js
import api from "./api.ts";

// login / register / me / logout đã có
const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};
const register = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data;
};
const me = async () => {
  const { data } = await api.get("/auth/me");
  return data; // {id,name,email,role,avatarUrl,...}
};
const logout = async () => {
  try { await api.post("/auth/logout"); } catch {}
};

/* ====== MỚI: cập nhật hồ sơ & đổi mật khẩu ====== */
const updateProfile = async (payload) => {
  // payload: {name, phone, address, avatarUrl?}
  const { data } = await api.put("/auth/profile", payload);
  return data;
};
const changePassword = async (oldPassword, newPassword) => {
  const { data } = await api.post("/auth/change-password", {
    oldPassword, newPassword,
  });
  return data;
};

/* ====== MỚI: upload avatar (tận dụng /files/upload) ====== */
const uploadAvatar = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post("/files/upload", form);
  // backend trả chuỗi URL/đường dẫn → mình trả nguyên để set avatarUrl
  return data;
};

export default { login, register, me, logout, updateProfile, changePassword, uploadAvatar };
