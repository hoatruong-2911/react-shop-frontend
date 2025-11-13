// src/pages/Admin/users/EditMemberPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../../../services/Admin/userService";
import { toast } from "react-toastify";

const EditMemberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await userService.getUserById(id);
        const u = res.data || {};
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: u.address || "",
          role: (u.role || "USER").toUpperCase(),
        });
      } catch (err) {
        console.error("Lỗi tải thành viên:", err);
        toast.error("Không thể tải thông tin thành viên!");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await userService.updateUser(id, form);
      toast.success("Cập nhật thông tin thành viên thành công!");
      navigate("/admin/members");
    } catch (err) {
      console.error("Lỗi cập nhật thành viên:", err?.response || err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Cập nhật thành viên thất bại!";
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center text-lg font-semibold">
        Đang tải thông tin thành viên...
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Chỉnh sửa thành viên (ID: {id})
      </h2>

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
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMemberPage;
