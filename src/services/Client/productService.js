import api from "../api.ts";

export const getAllProducts = () =>
  api.get("/products", { params: { _t: Date.now() } });

export const getProductById = (id) => api.get(`/products/${id}`);

export const searchProductsByName = (keyword) =>
  api.get("/products/search", { params: { keyword } });

export const searchProductsByPriceRange = (min, max) =>
  api.get("/products/search/price", { params: { min, max } });

const ClientProductService = {
  getAllProducts,
  getProductById,
  searchProductsByName,
  searchProductsByPriceRange,
};
export default ClientProductService;
