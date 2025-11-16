import React, { useState, useEffect } from "react";
import bannerService from "../../../services/Admin/bannerService";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toImageSrc, PLACEHOLDER_IMG } from "../../../services/utils/img";

const EditBannerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    linkUrl: "",
    position: "main-slider",
    status: 1,
    imageUrl: "",
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    bannerService.getBannerById(id).then((res) => {
      const b = res.data;

      setForm({
        name: b.name,
        linkUrl: b.linkUrl,
        position: b.position,
        status: b.status,
        imageUrl: b.imageUrl,
      });

      setPreview(toImageSrc({ image_url: b.imageUrl }) || PLACEHOLDER_IMG);
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("linkUrl", form.linkUrl);
    fd.append("position", form.position);
    fd.append("status", form.status);
    fd.append("imageUrl", form.imageUrl || "");

    if (form.file) fd.append("file", form.file);

    try {
      await bannerService.updateBanner(id, fd);
      toast.success("Cập nhật banner thành công!");
      navigate("/admin/banners");
    } catch (err) {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Sửa Banner</h2>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Ảnh */}
        <div>
          <label className="font-medium block mb-1">Ảnh Banner</label>
          <img
            src={preview || PLACEHOLDER_IMG}
            className="w-72 h-40 object-cover rounded border mb-3"
            alt="banner preview"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Tên banner */}
        <div>
          <label className="font-medium block mb-1">Tên Banner</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nhập tên banner"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Link điều hướng */}
        <div>
          <label className="font-medium block mb-1">Link điều hướng</label>
          <input
            name="linkUrl"
            value={form.linkUrl}
            onChange={handleChange}
            placeholder="VD: /product/10 hoặc http://google.com"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Vị trí */}
        <div>
          <label className="font-medium block mb-1">Vị trí hiển thị</label>
          <select
            name="position"
            value={form.position}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="main-slider">Main Slider</option>
            <option value="homepage-top">Homepage Top</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="font-medium block mb-1">Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Hiển thị</option>
            <option value={0}>Ẩn</option>
          </select>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default EditBannerPage;
