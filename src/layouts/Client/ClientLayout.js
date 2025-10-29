import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Phone,
  MapPin,
  Search,
  ShoppingBag,
  User,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../../contexts/CartContext"; // <-- 1. IMPORT USECART

import THDigitalLogo from "../../assets/images/thuong_hieu_cua_hoa.png";

// Component Header
const ClientHeader = () => {
  // 2. LẤY SỐ LƯỢNG TỪ CONTEXT
  const { cartCount } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="container mx-auto px-6 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>Hotline: 1900.4444</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>văn Lâm 3, Phước Nam, Thuận Nam, Ninh Thuận</span>
            </div>
          </div>
          {/* === THAY ĐỔI 1: STYLING TOP-BAR LINKS === */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-gray-700 text-base py-1 px-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Quản trị
            </Link>
            <Link
              to="/login"
              className="text-white text-base border bg-blue-600  py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </Link>
            <span className="text-gray-500 text-base">hoặc</span>
            <Link
              to="/register"
              className="text-white text-base bg-blue-600 py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-5 grid grid-cols-3 items-center ">
        {/* Logo */}
        <div className="justify-self-start">
          <Link to="/">
            {/* 2. Cập nhật thẻ <img> với logo mới */}
            <img
              src={THDigitalLogo}
              alt="TH Digital Logo"
              className="h-10 md:h-12 w-auto" // Điều chỉnh kích thước nếu cần
            />
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-lg justify-self-center">
          <input
            type="text"
            placeholder="Tìm sản phẩm, danh mục..."
            className="w-full border border-gray-300 rounded-full py-3 px-6 focus:outline-none focus:border-blue-500 text-base"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600">
            <Search size={22} />
          </button>
        </div>

        {/* Cart & Account */}
        <div className="flex items-center gap-6 justify-self-end">
          <Link
            to="/cart"
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} />
            {/* 3. THAY THẾ DÒNG CŨ BẰNG CODE MỚI NÀY */}
            <span>Giỏ hàng</span>
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-200">
        {/* === THAY ĐỔI 2: TĂNG CỠ CHỮ NAV-BAR === */}
        <nav className="container mx-auto px-6 py-4 flex justify-center gap-8 text-gray-700 font-medium text-lg">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <Link to="/products" className="hover:text-blue-600">
            Sản phẩm
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            Giới thiệu
          </Link>
          <Link to="/news" className="hover:text-blue-600">
            Tin tức công nghệ
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Liên hệ
          </Link>
        </nav>
      </div>
    </header>
  );
};

// Component Footer
const ClientFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Giới thiệu */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">TECH-SHOP</h3>
          <p className="mb-4">
            Chuyên cung cấp các sản phẩm công nghệ, thiết bị điện tử chính hãng
            với giá tốt nhất thị trường.
          </p>
          <p>
            <strong>Địa chỉ:</strong> 266 Đội Cấn, Ba Đình, Hà Nội
          </p>
          <p>
            <strong>Hotline:</strong> 1900.6750
          </p>
          <p>
            <strong>Giờ mở cửa:</strong> 8:00 - 21:00 (T2 - CN)
          </p>
        </div>

        {/* Cột 2: Hỗ trợ */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="hover:text-white">
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Chính sách đổi trả
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Chính sách giao hàng
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:text-white">
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Danh mục */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Danh mục</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="hover:text-white">
                Điện thoại
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white">
                Laptop
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white">
                Máy tính bảng
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white">
                Tai nghe & Loa
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-white">
                Phụ kiện
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Kết nối */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">
            Kết nối với chúng tôi
          </h4>
          <p className="mb-4">Nhận thông tin khuyến mãi mới nhất.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email của bạn"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6 text-center text-sm">
          © 2025 TECH-SHOP. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// Layout chính
const ClientLayout = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen bg-gray-50/50">
      <ClientHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ClientFooter />
    </div>
  );
};

export default ClientLayout;
