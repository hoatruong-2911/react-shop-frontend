import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Lấy tất cả danh mục
const getAllCategories = () => {
    return axios.get(`${API_URL}/categories`);
};

// Lấy chi tiết một danh mục theo ID
const getCategoryById = (id) => {
    return axios.get(`${API_URL}/categories/${id}`);
};

// Tạo mới một danh mục
const createCategory = (category) => {
    return axios.post(`${API_URL}/categories`, category);
};

// Cập nhật một danh mục
const updateCategory = (id, category) => {
    return axios.put(`${API_URL}/categories/${id}`, category);
};

// Xóa một danh mục
const deleteCategory = (id) => {
    return axios.delete(`${API_URL}/categories/${id}`);
};

const CategoryService = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

export default CategoryService;