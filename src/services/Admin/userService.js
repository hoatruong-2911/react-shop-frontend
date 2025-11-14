// src/services/Admin/userService.js
import api from "../api.ts";

const PREFIX = "/admin/users";

export const getAllUsers = () => api.get(PREFIX);

// Lấy user theo id
export const getUserById = (id) => api.get(`${PREFIX}/${id}`);

// Tạo user mới (admin tạo tài khoản thành viên)
// Body: { name, email, phone, address, password, role? }
export const createUser = (user) => api.post(PREFIX, user);

// Cập nhật user
export const updateUser = (id, user) => api.put(`${PREFIX}/${id}`, user);

// Xóa user
export const deleteUser = (id, force = false) => {
  return api.delete(`/admin/users/${id}`, {
    params: { force }       // => /admin/users/6?force=true
  });
};

// (Optional) Search theo tên/email nếu sau này backend có
export const searchUsers = (keyword) =>
  api.get(`${PREFIX}/search`, { params: { keyword } });

const UserService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
};

export default UserService;
