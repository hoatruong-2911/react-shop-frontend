import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminPostService from "../../../services/Admin/postService";
import AdminTopicService from "../../../services/Admin/topicService";
import { useNavigate } from "react-router-dom";

const AddPostPage = () => {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    topicId: "",
  });

  const [file, setFile] = useState(null);
  const [topics, setTopics] = useState([]);

  // Tải danh sách Topic
  const loadTopics = async () => {
    try {
      const res = await AdminTopicService.getAllTopics();
      setTopics(res.data);
    } catch (e) {
      toast.error("Không thể tải danh sách chủ đề!");
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  // Auto slug
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

    if (name === "title") {
      update.slug = generateSlug(value);
    }

    setForm(update);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }

    if (!form.topicId) {
      toast.error("Hãy chọn chủ đề!");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("slug", form.slug);
    data.append("content", form.content);
    data.append("topicId", form.topicId);

    if (file) data.append("file", file);

    try {
      await AdminPostService.createPostForm(data);
      toast.success("Thêm bài viết thành công!");
      nav("/admin/posts");
    } catch (err) {
      toast.error("Lỗi! Không thể thêm bài viết.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full">
      <h2 className="text-2xl font-semibold mb-4">Thêm Bài Viết</h2>

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

        {/* FILE UPLOAD */}
        <div>
          <label className="font-medium block mb-1">Ảnh đại diện</label>
          <input
            type="file"
            accept="image/*"
            className="border p-2 rounded w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-40 h-28 object-cover mt-3 rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Lưu bài viết
        </button>
      </form>
    </div>
  );
};

export default AddPostPage;
