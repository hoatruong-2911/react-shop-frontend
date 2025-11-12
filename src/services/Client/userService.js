// axios instance chung
import api from "../api.ts";

// Lấy thông tin user đăng nhập
export const getMe = () => api.get("/auth/me");              // {id,name,email,phone,address,avatarUrl}

// Cập nhật thông tin cá nhân (tên/điện thoại/địa chỉ/email…)
export const updateMe = (payload) => api.put("/users/me", payload);
// Nếu backend bạn đang dùng /users/{id}, đổi thành:
// export const updateMe = (payload) => api.put(`/users/${payload.id}`, payload);

// Đổi mật khẩu
export const changePassword = (payload /* { currentPassword, newPassword } */) =>
  api.post("/auth/change-password", payload);

const UserService = { getMe, updateMe, changePassword };
export default UserService;
