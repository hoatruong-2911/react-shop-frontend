import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerService from "../../../services/Admin/bannerService";
import { toast } from "react-toastify";

const AddBannerPage = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [position, setPosition] = useState("main-slider");
    const [status, setStatus] = useState(1);
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) return toast.error("Tên banner không được để trống");
        if (!file) return toast.error("Vui lòng chọn ảnh banner");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("linkUrl", linkUrl);
        formData.append("position", position);
        formData.append("status", status);
        formData.append("file", file);

        try {
            await bannerService.createBanner(formData);
            toast.success("Thêm banner thành công!");
            navigate("/admin/banners");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Thêm banner thất bại!");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Thêm Banner</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Tên Banner */}
                <div>
                    <label className="block font-semibold mb-1">Tên Banner</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Nhập tên banner"
                    />
                </div>

                {/* Link chuyển hướng */}
                <div>
                    <label className="block font-semibold mb-1">Link chuyển hướng</label>
                    <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="/products?category=3 hoặc /product/10"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <label className="block font-semibold mb-1">Ảnh Banner</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full"
                    />
                </div>

                {/* Position */}
                <div>
                    <label className="block font-semibold mb-1">Vị trí hiển thị</label>
                    <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="main-slider">Main Slider</option>
                        <option value="homepage-top">Trang chủ - top</option>
                        <option value="homepage-bottom">Trang chủ - bottom</option>
                        <option value="sidebar">Sidebar</option>
                    </select>
                </div>

                {/* Status */}
                <div>
                    <label className="block font-semibold mb-1">Trạng thái</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border p-2 rounded"
                    >
                        <option value={1}>Hiển thị</option>
                        <option value={0}>Ẩn</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Thêm Banner
                </button>
            </form>
        </div>
    );
};

export default AddBannerPage;
