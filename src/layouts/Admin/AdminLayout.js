import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../../App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../services/authService";

function AdminLayout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // Xác thực & ép quyền ADMIN/STAFF
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await authService.me(); // dùng cookie jwt
        const role = (me?.role || "").toUpperCase();
        if (!["ADMIN", "STAFF"].includes(role)) {
          navigate("/login", { replace: true });
          return;
        }
      } catch {
        navigate("/login", { replace: true });
        return;
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => { alive = false; };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // 1) Xoá cookie JWT trên server
      await authService.logout();
    } catch (_) {
      // ignore
    }
    try {
      // 2) Dọn client state
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      sessionStorage.clear();
      // 3) Báo cho header client cập nhật tên/nút
      window.dispatchEvent(new Event("auth-changed"));
    } catch (_) {}

    // 4) Điều hướng về trang login (hoặc "/")
    navigate("/login", { replace: true });
    // 5) Nếu muốn chắc chắn đồng bộ cookie → reload
    // window.location.reload();
  };

  if (checking) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-600">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans w-full mx-0">
      <ToastContainer position="top-right" autoClose={3000} theme="light" />

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Logo
        </div>
        <nav className="mt-5">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/products">Sản phẩm</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/categories">Danh mục</Link>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <Link to="/admin/users">Người dùng</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-white border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Quản trị hệ thống</h1>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Đăng Xuất
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
