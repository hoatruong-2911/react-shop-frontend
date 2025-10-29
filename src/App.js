import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { CartProvider } from './contexts/CartContext'; // <-- 1. IMPORT CART PROVIDER

// 1. IMPORT CÁC LAYOUT
import AdminLayout from './layouts/Admin/AdminLayout';
import ClientLayout from './layouts/Client/ClientLayout';

// 2. IMPORT CÁC TRANG CỦA ADMIN
import { default as AdminProductListPage } from './pages/Admin/products/ProductListPage'; 
import AddProductPage from './pages/Admin/products/AddProductPage';
import EditProductPage from './pages/Admin/products/EditProductPage';
import CategoryListPage from './pages/Admin/categorys/CategoryListPage';
import AddCategoryPage from './pages/Admin/categorys/AddCategoryPage';
import EditCategoryPage from './pages/Admin/categorys/EditCategoryPage';

// 3. IMPORT CÁC TRANG CLIENT
import HomePage from './pages/Client/HomePage';
import ProductListPage from './pages/Client/ProductListPage';
import ProductDetailPage from './pages/Client/ProductDetailPage';
import CartPage from './pages/Client/CartPage'; // <-- 4. IMPORT FILE THẬT

// 4. IMPORT TOASTIFY
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 5. CÁC COMPONENT GIỮ CHỖ (PLACEHOLDER)
// const CartPage = () => <div>Đây là Trang Giỏ Hàng</div>; // <-- 5. XÓA FILE GIỮ CHỖ
const DashboardPage = () => <div>Đây là Dashboard Admin</div>;
const UserPage = () => <div>Đây là Quản lý Người dùng</div>;


function App() {
  return (
    // 2. BỌC CARTPROVIDER RA NGOÀI CÙNG
    <CartProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Routes>
        
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} /> 
          {/* 6. ROUTE GIỎ HÀNG BÂY GIỜ DÙNG COMPONENT THẬT */}
          <Route path="cart" element={<CartPage />} />
        </Route>


        {/* === CÁC ROUTE CỦA ADMIN === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} /> 
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<AdminProductListPage />} /> 
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="edit-product/:id" element={<EditProductPage />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="add-category" element={<AddCategoryPage />} />
          <Route path="edit-category/:id" element={<EditCategoryPage />} />
          <Route path="users" element={<UserPage />} />
        </Route>

        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />

      </Routes>
    </CartProvider>
  );
}

export default App;