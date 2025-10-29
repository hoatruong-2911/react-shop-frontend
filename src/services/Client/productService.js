import axios from "axios";

const API_URL = "http://localhost:8080/api";

// --- Product Read-Only Functions ---
const getAllProducts = () => {
  // Giữ lại cache-busting param của bạn
  return axios.get(`${API_URL}/products`, {
    params: { _t: new Date().getTime() },
  });
};

const getProductById = (id) => {
  return axios.get(`${API_URL}/products/${id}`);
};

// --- Product Search Functions ---
const searchProductsByName = (keyword) => {
  return axios.get(`${API_URL}/products/search`, { params: { keyword } });
};

const searchProductsByPriceRange = (min, max) => {
  return axios.get(`${API_URL}/products/search/price`, {
    params: { min, max },
  });
};

const ClientProductService = {
  getAllProducts,
  getProductById,
  searchProductsByName,
  searchProductsByPriceRange,
};

export default ClientProductService;
