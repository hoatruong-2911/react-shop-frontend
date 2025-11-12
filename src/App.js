import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./contexts/CartContext";

// Layouts
import AdminLayout from "./layouts/Admin/AdminLayout";
import ClientLayout from "./layouts/Client/ClientLayout";

// Admin pages
import { default as AdminProductListPage } from "./pages/Admin/products/ProductListPage";
import AddProductPage from "./pages/Admin/products/AddProductPage";
import EditProductPage from "./pages/Admin/products/EditProductPage";
import CategoryListPage from "./pages/Admin/categorys/CategoryListPage";
import AddCategoryPage from "./pages/Admin/categorys/AddCategoryPage";
import EditCategoryPage from "./pages/Admin/categorys/EditCategoryPage";

// Client pages
import HomePage from "./pages/Client/HomePage";
import ProductListPage from "./pages/Client/ProductListPage";
import ProductDetailPage from "./pages/Client/ProductDetailPage";
import CartPage from "./pages/Client/CartPage";
import ProfilePage from "./pages/Client/ProfilePage";
// Auth
import LoginPage from "./pages/Auth/LoginPage";
import authService from "./services/authService";
import RegisterPage from "./pages/Auth/RegisterPage";
// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* =========================
   GUARDS
   ========================= */

/** Khi đã đăng nhập thì chặn vào /login; tự điều hướng theo role */
/** Khi đã đăng nhập thì chặn vào /login; tự điều hướng theo role */
function RedirectIfAuthed() {
  const [state, setState] = useState({ loading: true, role: null });
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    // ✅ Nếu client đã biết là CHƯA đăng nhập => cho vào /login ngay, KHÔNG gọi /auth/me
    const raw = localStorage.getItem("auth_user");
    if (!raw) {
      mounted && setState({ loading: false, role: null });
      return () => { mounted = false; };
    }

    // Nếu có auth_user thì xác nhận lại với server
    authService
      .me()
      .then((u) => mounted && setState({ loading: false, role: (u?.role || "").toUpperCase() }))
      .catch(() => mounted && setState({ loading: false, role: null }));

    return () => { mounted = false; };
  }, []);

  if (state.loading) return null; // hoặc spinner

  if (state.role === "ADMIN" || state.role === "STAFF") {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  if (state.role === "USER") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return <Outlet />;
}


/** Yêu cầu đăng nhập + đúng role (ví dụ ADMIN/STAFF) */
function RequireRole({ allow = [] }) {
  const [state, setState] = useState({ loading: true, ok: false });
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    authService
      .me()
      .then((u) => {
        const role = (u?.role || "").toUpperCase();
        const ok = allow.length === 0 || allow.includes(role);
        mounted && setState({ loading: false, ok });
      })
      .catch(() => mounted && setState({ loading: false, ok: false }));
    return () => (mounted = false);
  }, [allow]);

  if (state.loading) return null; // hoặc spinner

  return state.ok ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}

/* =========================
   APP
   ========================= */
function App() {
  return (
    <CartProvider>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      <Routes>
        {/* ======= Auth ======= */}
        <Route element={<RedirectIfAuthed />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* ======= Client area (public) ======= */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
        </Route>

        {/* ======= Admin area (ADMIN & STAFF) ======= */}
        <Route element={<RequireRole allow={["ADMIN", "STAFF"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<div>Đây là Dashboard Admin</div>} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="edit-product/:id" element={<EditProductPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="add-category" element={<AddCategoryPage />} />
            <Route path="edit-category/:id" element={<EditCategoryPage />} />
            <Route path="users" element={<div>Đây là Quản lý Người dùng</div>} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
