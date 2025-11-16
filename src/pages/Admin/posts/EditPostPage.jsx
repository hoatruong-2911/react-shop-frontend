import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminPostService from "../../../services/Admin/postService";
import AdminTopicService from "../../../services/Admin/topicService";

const EditPostPage = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    topicId: "",
    imageUrl: "",
  });

  const [newFile, setNewFile] = useState(null); // file upload mới

  const loadTopics = async () => {
    try {
      const res = await AdminTopicService.getAllTopics();
      setTopics(res.data);
    } catch (e) {
      toast.error("Không thể tải danh sách chủ đề!");
    }
  };

  const loadPost = async () => {
    try {
      const res = await AdminPostService.getPostById(id);
      setForm(res.data);
      setLoading(false);
    } catch (e) {
      toast.error("Không thể tải bài viết!");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
    loadPost();
  }, []);

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const update = { ...form, [name]: value };

    if (name === "title") update.slug = generateSlug(value);

    setForm(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("slug", form.slug);
    data.append("content", form.content);
    data.append("topicId", form.topicId);

    if (newFile) data.append("file", newFile); // chỉ upload khi đổi ảnh

    try {
      await AdminPostService.updatePostForm(id, data);
      toast.success("Cập nhật bài viết thành công!");
      nav("/admin/posts");
    } catch (err) {
      toast.error("Lỗi! Không thể cập nhật bài viết.");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa Bài Viết</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* TITLE */}
        <div>
          <label className="font-medium block mb-1">Tiêu đề *</label>
          <input
            type="text"
            name="title"
            className="border p-2 rounded w-full"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        {/* SLUG */}
        <div>
          <label className="font-medium block mb-1">Slug (tự động)</label>
          <input
            type="text"
            name="slug"
            className="border p-2 rounded w-full bg-gray-100"
            value={form.slug}
            readOnly
          />
        </div>

        {/* CONTENT */}
        <div>
          <label className="font-medium block mb-1">Nội dung</label>
          <textarea
            name="content"
            rows="5"
            className="border p-2 rounded w-full"
            value={form.content}
            onChange={handleChange}
          />
        </div>

        {/* TOPIC SELECT */}
        <div>
          <label className="font-medium block mb-1">Chủ đề *</label>
          <select
            name="topicId"
            className="border p-2 rounded w-full"
            value={form.topicId}
            onChange={handleChange}
          >
            <option value="">-- Chọn chủ đề --</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* OLD IMAGE */}
        <div>
          <label className="font-medium block mb-1">Ảnh hiện tại</label>
          {form.imageUrl ? (
            <img
              src={form.imageUrl}
              alt="old"
              className="w-40 h-28 object-cover rounded border"
            />
          ) : (
            <p className="text-gray-500 italic">Không có ảnh</p>
          )}
        </div>

        {/* NEW FILE UPLOAD */}
        <div>
          <label className="font-medium block mb-1">Đổi ảnh (nếu muốn)</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full"
            onChange={(e) => setNewFile(e.target.files[0])}
          />

          {newFile && (
            <img
              src={URL.createObjectURL(newFile)}
              alt="new preview"
              className="w-40 h-28 object-cover mt-3 rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
