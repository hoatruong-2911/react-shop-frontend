// dùng đúng /products, KHÔNG có /admin
import api from "../api.ts";

export const uploadFile = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/files/upload", form);
  // BE trả về CHUỖI url -> trả thẳng
  return typeof res.data === "string" ? res.data : (res.data?.url || "");
};

export const getAllProducts = () =>
  api.get("/products", { params: { _t: Date.now() } });

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (product) =>
  api.post("/products", product);        // BE chặn quyền ADMIN

export const updateProduct = (id, product) =>
  api.put(`/products/${id}`, product);   // BE chặn quyền ADMIN

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);         // BE chặn quyền ADMIN

export default {
  uploadFile,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
