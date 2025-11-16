import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./contexts/CartContext";

// Layouts
import AdminLayout from "./layouts/Admin/AdminLayout";
import ClientLayout from "./layouts/Client/ClientLayout";

//--------------------- Admin pages
import { default as AdminProductListPage } from "./pages/Admin/products/ProductListPage";
import AddProductPage from "./pages/Admin/products/AddProductPage";
import EditProductPage from "./pages/Admin/products/EditProductPage";
import CategoryListPage from "./pages/Admin/categorys/CategoryListPage";
import AddCategoryPage from "./pages/Admin/categorys/AddCategoryPage";
import EditCategoryPage from "./pages/Admin/categorys/EditCategoryPage";
import MemberListPage from "./pages/Admin/users/MemberListPage";
import AddMemberPage from "./pages/Admin/users/AddMemberPage";
import EditMemberPage from "./pages/Admin/users/EditMemberPage";
import OrderListPage from "./pages/Admin/orders/OrderListPage";
import OrderDetailPage from "./pages/Admin/orders/OrderDetailPage";
import DashboardPage from "./pages/Admin/dashboard/DashboardPage";
import ReviewListPage from "./pages/Admin/reviews/ReviewListPage";
// brand
import BrandListPage from "./pages/Admin/brands/BrandListPage";
import AddBrandPage from "./pages/Admin/brands/AddBrandPage";
import EditBrandPage from "./pages/Admin/brands/EditBrandPage";


// Client pages

// banners
import BannerListPage from "./pages/Admin/banners/BannerListPage";
import AddBannerPage from "./pages/Admin/banners/AddBannerPage";
import EditBannerPage from "./pages/Admin/banners/EditBannerPage";

// topic
import TopicListPage from "./pages/Admin/topics/TopicListPage";
import AddTopicPage from "./pages/Admin/topics/AddTopicPage";
import EditTopicPage from "./pages/Admin/topics/EditTopicPage";

// post
import PostListPage from "./pages/Admin/posts/PostListPage";
import AddPostPage from "./pages/Admin/posts/AddPostPage";
import EditPostPage from "./pages/Admin/posts/EditPostPage";

// -------------------Client pages

import HomePage from "./pages/Client/HomePage";
import ProductListPage from "./pages/Client/ProductListPage";
import ProductDetailPage from "./pages/Client/ProductDetailPage";
import CartPage from "./pages/Client/CartPage";
import ProfilePage from "./pages/Client/ProfilePage";
import CheckoutPage from "./pages/Client/CheckoutPage";
import MyOrdersPage from "./pages/Client/MyOrdersPage";
import AboutPage from "./pages/Client/AboutPage";
// Auth
import LoginPage from "./pages/Auth/LoginPage";
import authService from "./services/authService";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// post
// Client posts
import PostPage from "./pages/Client/PostPage";
import PostDetailPage from "./pages/Client/PostDetailPage";

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
      return () => {
        mounted = false;
      };
    }

    // Nếu có auth_user thì xác nhận lại với server
    authService
      .me()
      .then(
        (u) =>
          mounted &&
          setState({ loading: false, role: (u?.role || "").toUpperCase() })
      )
      .catch(() => mounted && setState({ loading: false, role: null }));

    return () => {
      mounted = false;
    };
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
          <Route path="/forgot" element={<ForgotPasswordPage />} />
        </Route>

        {/* ======= Client area (public) ======= */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="about" element={<AboutPage />} />

          {/* post */}
          <Route path="post" element={<PostPage />} />
          <Route path="post/:slug" element={<PostDetailPage />} />
        </Route>

        {/* ======= Admin area (ADMIN & STAFF) ======= */}
        <Route element={<RequireRole allow={["ADMIN", "STAFF"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<AdminProductListPage />} />
            <Route path="add-product" element={<AddProductPage />} />
            <Route path="edit-product/:id" element={<EditProductPage />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="add-category" element={<AddCategoryPage />} />
            <Route path="edit-category/:id" element={<EditCategoryPage />} />
            <Route path="reviews" element={<ReviewListPage />} />
            {/* brand */}
            <Route path="brands" element={<BrandListPage />} />
            <Route path="add-brand" element={<AddBrandPage />} />
            <Route path="edit-brand/:id" element={<EditBrandPage />} />

            {/* banners */}
            <Route path="banners" element={<BannerListPage />} />
            <Route path="add-banner" element={<AddBannerPage />} />
            <Route path="edit-banner/:id" element={<EditBannerPage />} />

            {/*  TOPICS  */}
            <Route path="topics" element={<TopicListPage />} />
            <Route path="topics/add" element={<AddTopicPage />} />
            <Route path="topics/edit/:id" element={<EditTopicPage />} />

            {/* post */}
            <Route path="posts" element={<PostListPage />} />
            <Route path="posts/add" element={<AddPostPage />} />
            <Route path="posts/edit/:id" element={<EditPostPage />} />

            <Route path="members" element={<MemberListPage />} />
            <Route path="members/add" element={<AddMemberPage />} />
            <Route path="members/edit/:id" element={<EditMemberPage />} />
            <Route path="orders" element={<OrderListPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
