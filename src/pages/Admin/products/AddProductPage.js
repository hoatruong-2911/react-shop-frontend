import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/Admin/productService";
import categoryService from "../../../services/Admin/categoryService";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => toast.error("Không thể tải danh mục!"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files?.[0] || null);

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
    };

    try {
      toast.info("Đang upload ảnh...");
      const imageUrl = await productService.uploadFile(selectedFile);
      payload.imageUrl = imageUrl;

      await productService.createProduct(payload);
      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi khi thêm sản phẩm:", err);
      toast.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Thêm Sản phẩm mới</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Ảnh:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md file:bg-blue-50 file:text-blue-700 file:rounded-full hover:file:bg-blue-100"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Tên:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Giá:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Số lượng:</label>
          <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Mô tả:</label>
          <textarea name="description" value={product.description} onChange={handleChange} rows="3" className="w-3/4 p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Danh mục:</label>
          <select name="categoryId" value={product.categoryId} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md">
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
