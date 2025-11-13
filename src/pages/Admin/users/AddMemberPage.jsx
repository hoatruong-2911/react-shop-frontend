// src/pages/Admin/users/AddMemberPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../../services/Admin/userService";
import { toast } from "react-toastify";

const AddMemberPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "USER", // mặc định
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("Vui lòng nhập đầy đủ Tên, Email và Mật khẩu!");
      return;
    }

    try {
      await userService.createUser(form);
      toast.success("Thêm thành viên mới thành công!");
      navigate("/admin/members");
    } catch (err) {
      console.error("Lỗi thêm thành viên:", err?.response || err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Thêm thành viên thất bại!";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Thêm thành viên mới</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Họ tên:
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Số điện thoại:
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Địa chỉ:
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Mật khẩu:
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Vai trò:
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          >
            <option value="USER">Khách hàng</option>
            <option value="STAFF">Nhân viên</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          >
            Thêm thành viên
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberPage;
