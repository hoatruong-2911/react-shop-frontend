import React, { useEffect, useState } from "react";
import AdminTopicService from "../../../services/Admin/topicService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditTopicPage = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AdminTopicService.getTopicById(id)
      .then((res) => setForm(res.data))
      .catch(() => toast.error("Không tìm thấy topic!"));
  }, [id]);

  if (!form) return <div>Đang tải...</div>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminTopicService.updateTopic(id, form);
      toast.success("Cập nhật thành công!");
      navigate("/admin/topics");
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa Topic</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Tên Topic */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Tên chủ đề
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Nhập tên topic..."
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Slug (đường dẫn)
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Nhập slug..."
          />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditTopicPage;
