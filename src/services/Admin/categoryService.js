// src/services/Admin/categoryService.js
import api from "../api.ts";

// KHÔNG dùng /admin prefix, để BE chặn bằng @PreAuthorize
export const getAllCategories = () =>
  api.get("/categories", { params: { _t: Date.now() } });

export const getCategoryById = (id) =>
  api.get(`/categories/${id}`);

export const createCategory = (payload) =>
  api.post("/categories", payload);          // ADMIN

export const updateCategory = (id, payload) =>
  api.put(`/categories/${id}`, payload);     // ADMIN

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`);           // ADMIN

const CategoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
export default CategoryService;
