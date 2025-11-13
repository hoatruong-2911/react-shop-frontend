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
export const deleteUser = (id) => api.delete(`${PREFIX}/${id}`);

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
