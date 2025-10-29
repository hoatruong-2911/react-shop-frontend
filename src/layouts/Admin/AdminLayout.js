import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../App.css"; // Giữ lại đường dẫn này
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLayout() {
  return (
    // THÊM "mx-0" ĐỂ GHI ĐÈ LẠI MARGIN-AUTO
    <div className="flex h-screen bg-gray-100 font-sans w-full mx-0">
      
      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Logo
        </div>
        <nav className="mt-5">
          <ul>
            {/* CẬP NHẬT ĐƯỜNG DẪN ADMIN */}
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
            <button className="bg-blue-500 text-white py-2 px-4 rounded">
              Điện thoại
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Đây là nơi render trang con (ProductList, CategoryList...) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
