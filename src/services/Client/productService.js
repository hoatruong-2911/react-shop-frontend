// src/services/Client/productService.js
import api from "../api.ts";

// Lấy tất cả sản phẩm (có thể kèm params lọc)
const getAllProducts = (params) =>
  api.get("/products", { params });

// Lấy chi tiết 1 sản phẩm
const getProductById = (id) =>
  api.get(`/products/${id}`);

// Tìm theo tên
const searchProductsByName = (keyword) =>
  api.get("/products/search", { params: { keyword } });

// Tìm theo khoảng giá
const searchProductsByPriceRange = (min, max) =>
  api.get("/products/search/price", { params: { min, max } });

/* ====== PHẦN MỚI: REVIEWS ====== */

// Lấy danh sách review của 1 sản phẩm
const getProductReviews = (productId) =>
  api.get(`/products/${productId}/reviews`);

// Gửi review cho 1 sản phẩm
// payload: { rating, comment }
const createProductReview = (productId, payload) =>
  api.post(`/products/${productId}/reviews`, payload);

/* ====== EXPORT DEFAULT ====== */

const productService = {
  getAllProducts,
  getProductById,
  searchProductsByName,
  searchProductsByPriceRange,

  // nhớ thêm 2 hàm này
  getProductReviews,
  createProductReview,
};

export default productService;
