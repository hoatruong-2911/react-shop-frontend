import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Lấy tất cả danh mục
const getAllCategories = () => {
  // Thêm tham số cache-busting giống file product
  return axios.get(`${API_URL}/categories`, {
    params: { _t: new Date().getTime() },
  });
};

// Lấy chi tiết một danh mục theo ID
const getCategoryById = (id) => {
  return axios.get(`${API_URL}/categories/${id}`);
};

const ClientCategoryService = {
  getAllCategories,
  getCategoryById,
};

export default ClientCategoryService;
