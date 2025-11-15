// src/services/Admin/reviewService.js
import api from "../api.ts";

// Lấy tất cả review cho admin
const getAllReviews = () => api.get("/admin/reviews");

// Xóa review theo id
const deleteReview = (id) => api.delete(`/admin/reviews/${id}`);

// (tuỳ chọn) Toggle active nếu bạn có API này:
// const toggleActive = (id, active) =>
//   api.patch(`/admin/reviews/${id}/active`, null, { params: { active } });

const AdminReviewService = {
  getAllReviews,
  deleteReview,
  // toggleActive,
};

export default AdminReviewService;
