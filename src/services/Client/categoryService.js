import api from "../api.ts";

export const getAllCategories = () =>
  api.get("/categories", { params: { _t: Date.now() } });

export const getCategoryById = (id) => api.get(`/categories/${id}`);

const ClientCategoryService = { getAllCategories, getCategoryById };
export default ClientCategoryService;
