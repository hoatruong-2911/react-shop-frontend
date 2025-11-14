import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import brandService from '../../../services/Admin/brandService';
import productService from '../../../services/Admin/productService';
import { toast } from 'react-toastify';
import { PLACEHOLDER_IMG } from '../../../services/utils/img';

const AddBrandPage = () => {
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    name: "",
    logoUrl: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImg, setPreviewImg] = useState(PLACEHOLDER_IMG);

  const handleChange = (e) => {
    setBrand({ ...brand, name: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) {
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Vui lòng chọn một logo thương hiệu!");
      return;
    }

    try {
      toast.info("Đang upload ảnh...");

      // Upload ảnh
      const logoUrl = await productService.uploadFile(selectedFile);

      const newBrand = {
        name: brand.name,
        logoUrl: logoUrl
      };

      await brandService.createBrand(newBrand);

      toast.success("Thêm thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (err) {
      console.error("Lỗi khi thêm thương hiệu:", err);
      toast.error("Thêm thương hiệu thất bại!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Thêm Thương hiệu mới</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Brand Name */}
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Tên thương hiệu:
          </label>

          <input
            type="text"
            value={brand.name}
            onChange={handleChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Brand Logo Upload */}
        <div className="flex items-start">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right pt-2">
            Logo:
          </label>

          <div className="w-3/4">
            <img
              src={previewImg}
              alt="Brand Logo"
              className="h-24 w-24 object-cover mb-3 border rounded"
              onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md file:bg-blue-50 file:text-blue-700 file:rounded-full hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          >
            Thêm thương hiệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrandPage;
