import api from "../api.ts";

export const getAllBrands = () =>
  api.get("/brands", { params: { _t: Date.now() } });
export const getBrandBySlug = (slug) => api.get(`/brands/${slug}`);

const ClientBrandService = { getAllBrands, getBrandBySlug };
export default ClientBrandService;
