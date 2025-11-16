import React, { useState } from "react";
import AdminTopicService from "../../../services/Admin/topicService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTopicPage = () => {
  const [form, setForm] = useState({ name: "", slug: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminTopicService.createTopic(form);
      toast.success("Tạo topic thành công!");
      navigate("/admin/topics");
    } catch {
      toast.error("Tạo topic thất bại!");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Thêm Topic</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Tên chủ đề"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="slug"
          placeholder="Slug (tự tạo nếu để trống)"
          value={form.slug}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          type="submit"
        >
          Thêm mới
        </button>
      </form>
    </div>
  );
};

export default AddTopicPage;
