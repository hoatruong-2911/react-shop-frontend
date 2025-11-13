// src/pages/Admin/users/MemberListPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userService from "../../../services/Admin/userService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";

const ROLES_LABEL = {
  ADMIN: "Quản trị viên",
  STAFF: "Nhân viên",
  USER: "Khách hàng",
};

const MemberListPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  // Lấy role hiện tại từ auth_user
  let currentRole = "";
  try {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      const u = JSON.parse(raw);
      currentRole = (u.role || "").toString().toUpperCase();
    }
  } catch {
    currentRole = "";
  }
  const isAdmin = currentRole === "ADMIN";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await userService.getAllUsers();
      const data = res.data || [];
      // sort theo id tăng dần
      const sorted = [...data].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      setAllUsers(sorted);
      setFilteredUsers(sorted);
    } catch (err) {
      console.error("Lỗi tải danh sách thành viên", err);
      toast.error("Không thể tải danh sách thành viên!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo search + role
  useEffect(() => {
    let result = allUsers;

    if (searchTerm) {
      const k = searchTerm.toLowerCase();
      result = result.filter((u) =>
        ((u.name || "") + (u.email || "")).toLowerCase().includes(k)
      );
    }

    if (roleFilter) {
      result = result.filter((u) => (u.role || "").toUpperCase() === roleFilter);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, allUsers]);

  const handleDelete = (id) => {
    if (!isAdmin) return; // an toàn
    if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên ID ${id}?`)) {
      userService
        .deleteUser(id)
        .then(() => {
          toast.success("Xóa thành viên thành công!");
          loadData();
        })
        .catch((err) => {
          console.error("Lỗi xóa thành viên", err);
          toast.error("Xóa thành viên thất bại!");
        });
    }
  };

  const resetFilter = () => {
    setSearchTerm("");
    setRoleFilter("");
  };

  // Phân trang
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirst, indexOfLast);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full text-center text-lg font-semibold">
        Đang tải danh sách thành viên...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quản lý thành viên</h2>

        {isAdmin && (
          <Link to="/admin/members/add">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm thành viên
            </button>
          </Link>
        )}
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="relative flex-grow min-w-[220px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="STAFF">Nhân viên</option>
          <option value="USER">Khách hàng</option>
        </select>

        <button
          onClick={resetFilter}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Tên
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Số điện thoại
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Địa chỉ
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Vai trò
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentItems.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900">{u.id}</td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {u.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{u.email}</td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {u.phone || "-"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {u.address || "-"}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {ROLES_LABEL[(u.role || "").toUpperCase()] || u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium">
                  {isAdmin ? (
                    <>
                      <Link to={`/admin/members/edit/${u.id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs mr-2">
                          Sửa
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                        onClick={() => handleDelete(u.id)}
                      >
                        Xóa
                      </button>
                    </>
                  ) : (
                    <span className="opacity-60">Chỉ xem</span>
                  )}
                </td>
              </tr>
            ))}

            {currentItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-4 text-center text-gray-500 text-sm"
                >
                  Không có thành viên nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredUsers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default MemberListPage;
