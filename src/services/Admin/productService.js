import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// === HÀM MỚI ĐỂ UPLOAD FILE ===
const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file); // "file" phải khớp với @RequestParam("file") ở backend

    return axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// --- Product CRUD Functions ---
const getAllProducts = () => {
    // Thêm một tham số ngẫu nhiên (dựa vào thời gian) để tránh bị cache
    return axios.get(`${API_URL}/products`, { params: { _t: new Date().getTime() } });
};

const getProductById = (id) => {
    return axios.get(`${API_URL}/products/${id}`);
};

const createProduct = (product) => {
    return axios.post(`${API_URL}/products`, product);
};

const updateProduct = (id, product) => {
    
    return axios.put(`${API_URL}/products/${id}`, product);
};

const deleteProduct = (id) => {
    return axios.delete(`${API_URL}/products/${id}`);
};

// --- Product Search Functions ---
const searchProductsByName = (keyword) => {
    return axios.get(`${API_URL}/products/search`, { params: { keyword } });
};

const searchProductsByPriceRange = (min, max) => {
    return axios.get(`${API_URL}/products/search/price`, { params: { min, max } });
};

const ProductService = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProductsByName,
    searchProductsByPriceRange,
    uploadFile
};

export default ProductService;