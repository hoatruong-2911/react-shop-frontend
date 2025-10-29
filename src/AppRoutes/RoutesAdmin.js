import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- ĐƯỜNG DẪN ĐÚNG ĐỂ IMPORT TỪ THƯ MỤC 'product' ---
import ProductListPage from '../pages/Admin/products/ProductListPage';
import AddProductPage from '../pages/Admin/products/AddProductPage';
import EditProductPage from '../pages/Admin/products/EditProductPage';

// --- ĐƯỜNG DẪN ĐÚNG ĐỂ IMPORT TỪ THƯ MỤC 'category' ---
import CategoryListPage from '../pages/Admin/categorys/CategoryListPage';
import AddCategoryPage from '../pages/Admin/categorys/AddCategoryPage';
import EditCategoryPage from '../pages/Admin/categorys/EditCategoryPage';

const RoutesAdmin = () => {
    return (
        <Routes>
            {/* Route mặc định, chuyển hướng về trang sản phẩm */}
            <Route path="/" element={<Navigate replace to="/products" />} />

            {/* Các Route cho Sản phẩm */}
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />

            {/* Các Route cho Danh mục */}
            <Route path="/categories" element={<CategoryListPage />} />
            <Route path="/add-category" element={<AddCategoryPage />} />
            <Route path="/edit-category/:id" element={<EditCategoryPage />} />
        </Routes>
    );
};

export default RoutesAdmin;