import api from "../api.ts";

// ===== LẤY TẤT CẢ BANNER =====
export const getAllBanners = () => api.get("/banners");

// ===== LẤY BANNER THEO ID =====
export const getBannerById = (id) => api.get(`/banners/${id}`);

// ===== LẤY BANNER THEO POSITION (trang client) =====
// VD: /banners?position=main-slider
export const getBannersByPosition = (position) =>
    api.get(`/banners?position=${position}`);

// ===== TẠO MỚI BANNER (ADMIN) =====
export const createBanner = (payload) => api.post("/banners", payload);

// ===== CẬP NHẬT BANNER (ADMIN) =====
export const updateBanner = (id, payload) => api.put(`/banners/${id}`, payload);

// ===== XOÁ BANNER (ADMIN) =====
export const deleteBanner = (id) => api.delete(`/banners/${id}`);

export default {
    getAllBanners,
    getBannerById,
    getBannersByPosition,
    createBanner,
    updateBanner,
    deleteBanner
};
