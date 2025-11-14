import api from "../api.ts";

export const getAllBrands = () => api.get("/brands");

// LẤY BRAND THEO ID (DÙNG CHO EDIT PAGE)
export const getBrandById = (id) => api.get(`/brands/${id}`);

// LẤY BRAND THEO SLUG (DÙNG CHO TRANG USER)
export const getBrandBySlug = (slug) => api.get(`/brands/slug/${slug}`);

export const createBrand = (payload) => api.post("/brands", payload); // ADMIN
export const updateBrand = (id, payload) => api.put(`/brands/${id}`, payload); // ADMIN
export const deleteBrand = (id) => api.delete(`/brands/${id}`); // ADMIN

export default {
    getAllBrands,
    getBrandById,
    getBrandBySlug,
    createBrand,
    updateBrand,
    deleteBrand
};
