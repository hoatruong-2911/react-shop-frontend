// src/layouts/Client/ClientLayout.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Phone, MapPin, Search, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import THDigitalLogo from "../../assets/images/thuong_hieu_cua_hoa.png";
import authService from "../../services/authService";

const ClientHeader = () => {
  const { cartCount } = useCart();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef(null);

  // Đồng bộ khi auth thay đổi (login / logout)
  useEffect(() => {
    const onAuthChanged = () => {
      try {
        const raw = localStorage.getItem("auth_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, []);

  // Đồng bộ khi tab khác thay đổi localStorage (multi tab)
  useEffect(() => {
    const onStorage = () => {
      try {
        const raw = localStorage.getItem("auth_user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const onDocClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const displayName = useMemo(() => {
    if (!user) return "";
    return user.name || user.email || "Tài khoản";
  }, [user]);

  // Logout: chỉ cần gọi authService.logout (nó tự clear + redirect)
  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
      // nếu lỗi mạng, vẫn reload login vì logout có window.location.replace
    }
  };

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

          {/* Account */}
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-white text-base border bg-blue-600 py-1 px-3 rounded-lg hover:bg-blue-700"
                >
                  Đăng nhập
                </Link>
                <span className="text-gray-500 text-base">hoặc</span>
                <Link
                  to="/register"
                  className="text-white text-base bg-blue-600 py-1 px-3 rounded-lg hover:bg-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 py-1 px-3 rounded-lg hover:bg-gray-300"
                >
                  <User size={18} />
                  <span className="font-medium">{displayName}</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tài khoản của tôi
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setMenuOpen(false)}
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-6 py-5 grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <Link to="/">
            <img
              src={THDigitalLogo}
              alt="TH Digital"
              className="h-10 md:h-12 w-auto"
            />
          </Link>
        </div>

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

        <div className="flex items-center gap-6 justify-self-end">
          <Link
            to="/cart"
            className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-full flex items-center gap-2 hover:bg-blue-700"
          >
            <ShoppingBag size={20} />
            <span>Giỏ hàng</span>
            <span className="bg-white text-blue-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <div className="border-t border-gray-200">
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

const ClientFooter = () => (
  <footer className="bg-gray-900 text-gray-400">
    {/* tuỳ bạn giữ footer cũ */}
    <div className="border-t border-gray-800">
      <div className="container mx-auto px-6 py-6 text-center text-sm">
        © 2025 TECH-SHOP. All rights reserved.
      </div>
    </div>
  </footer>
);

const ClientLayout = () => (
  <div className="font-sans flex flex-col min-h-screen bg-gray-50/50">
    <ClientHeader />
    <main className="flex-grow">
      <Outlet />
    </main>
    <ClientFooter />
  </div>
);

export default ClientLayout;
