import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import productService from "../../../services/Admin/productService";
import categoryService from "../../../services/Admin/categoryService";
import brandService from "../../../services/Admin/brandService";

import { toast } from "react-toastify";

const AddProductPage = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    categoryId: "",
    brandId: ""
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Load category + brand
  useEffect(() => {
    categoryService.getAllCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error("Không thể tải danh mục!"));

    brandService.getAllBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() => toast.error("Không thể tải thương hiệu!"));
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // File
  const handleFileChange = (e) => setSelectedFile(e.target.files?.[0] || null);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Vui lòng chọn hình ảnh!");
      return;
    }

    const payload = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
      categoryId: Number(product.categoryId),
      brandId: Number(product.brandId)
    };

    try {
      toast.info("Đang upload ảnh...");
      const imageUrl = await productService.uploadFile(selectedFile);
      payload.imageUrl = imageUrl;

      await productService.createProduct(payload);

      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("🔥 FULL ERROR:", err);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        ➕ Thêm Sản Phẩm
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10 w-full">
        
        {/* ==== HÀNG 1: ẢNH - TÊN - DANH MỤC ==== */}
        <div className="grid grid-cols-3 gap-6 w-full">
          
          {/* Ảnh */}
          <div className="border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3">Ảnh sản phẩm</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Tên */}
          <div className="border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3">Tên sản phẩm</h3>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Nhập tên sản phẩm..."
            />
          </div>

          {/* Danh mục */}
          <div className="border rounded-2xl p-4 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">Danh mục</h3>
            <select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ==== HÀNG 2: GIÁ - SỐ LƯỢNG - THƯƠNG HIỆU ==== */}
        <div className="grid grid-cols-3 gap-6 w-full">

          {/* Giá */}
          <div className="border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3">Giá</h3>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Nhập giá..."
            />
          </div>

          {/* Số lượng */}
          <div className="border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3">Số lượng</h3>
            <input
              type="number"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              placeholder="Nhập số lượng..."
            />
          </div>

          {/* Thương hiệu */}
          <div className="border rounded-2xl p-4 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">Thương hiệu</h3>
            <select
              name="brandId"
              value={product.brandId}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ==== HÀNG 3: MÔ TẢ ==== */}
        <div className="border rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Mô tả</h3>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 border rounded-md"
            placeholder="Nhập mô tả..."
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-10 rounded-lg shadow-md"
          >
            ➕ Thêm sản phẩm
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProductPage;
