import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import brandService from "../../../services/Admin/brandService";
import productService from "../../../services/Admin/productService";
import { toast } from "react-toastify";
import { toImageSrc, PLACEHOLDER_IMG } from "../../../services/utils/img";

const EditBrandPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brand, setBrand] = useState({
    name: "",
    logoUrl: "",
  });

  const [previewImg, setPreviewImg] = useState(PLACEHOLDER_IMG);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = async () => {
    try {
      const res = await brandService.getBrandById(id);
      const data = res.data || {};

      setBrand({
        name: data.name || "",
        logoUrl: data.logoUrl || "",
      });

      setPreviewImg(toImageSrc({ image_url: data.logoUrl }) || PLACEHOLDER_IMG);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin thương hiệu!");
    }
  };

  const handleChange = (e) => {
    setBrand({ ...brand, name: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    if (file) setPreviewImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = brand.logoUrl;

      if (selectedFile) {
        toast.info("Đang upload ảnh...");
        imageUrl = await productService.uploadFile(selectedFile);
      }

      const updatedBrand = {
        name: brand.name,
        logoUrl: imageUrl,
      };

      await brandService.updateBrand(id, updatedBrand);

      toast.success("Cập nhật thương hiệu thành công!");
      navigate("/admin/brands");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa Thương hiệu</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tên brand */}
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

        {/* Logo */}
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
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrandPage;
