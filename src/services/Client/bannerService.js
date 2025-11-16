// src/services/Client/bannerService.js
import api from "../api.ts";

// Lấy tất cả banner (có thể filter theo position)
export const getAllBanners = (position) =>
  api.get("/banners", {
    params: {
      position: position || undefined,
      _t: Date.now(), // tránh cache
    },
  });

// Lấy 1 banner theo id
export const getBannerById = (id) => api.get(`/banners/${id}`);

const ClientBannerService = {
  getAllBanners,
  getBannerById,
};

export default ClientBannerService;
