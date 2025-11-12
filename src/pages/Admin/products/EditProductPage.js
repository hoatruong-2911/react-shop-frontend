import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/Admin/productService";
import categoryService from "../../../services/Admin/categoryService";
import { toast } from "react-toastify";
import { toImageSrc, PLACEHOLDER_IMG } from "../../../services/utils/img";

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    categoryId: "",
    imageUrl: "",
  });
  const [categories, setCategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [prodRes, cateRes] = await Promise.all([
          productService.getProductById(id),
          categoryService.getAllCategories(),
        ]);
        setProduct(prodRes.data || {});
        setCategories(cateRes.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        toast.error("Không thể tải dữ liệu sản phẩm/danh mục!");
      }
    })();
  }, [id]);

  const currentImageUrl = useMemo(() => toImageSrc(product), [product?.imageUrl]);
  const newImagePreview = useMemo(() => (newImageFile ? URL.createObjectURL(newImageFile) : ""), [newImageFile]);

  useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setNewImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
      categoryId: Number(product.categoryId),
    };

    try {
      if (newImageFile) {
        toast.info("Đang upload ảnh mới...");
        const imageUrl = await productService.uploadFile(newImageFile);
        updated.imageUrl = imageUrl;
      }

      await productService.updateProduct(id, updated);
      toast.success("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa Sản phẩm (ID: {id})</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <label className="w-1/4 text-right font-semibold text-gray-700">Tên:</label>
          <input type="text" name="name" value={product.name || ""} onChange={handleChange} className="w-3/4 p-2 border rounded-md" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-right font-semibold text-gray-700">Giá:</label>
          <input type="number" name="price" value={product.price ?? 0} onChange={handleChange} className="w-3/4 p-2 border rounded-md" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-right font-semibold text-gray-700">Số lượng:</label>
          <input type="number" name="quantity" value={product.quantity ?? 0} onChange={handleChange} className="w-3/4 p-2 border rounded-md" />
        </div>

        <div className="flex items-start">
          <label className="w-1/4 text-right font-semibold text-gray-700 mt-2">Mô tả:</label>
          <textarea name="description" value={product.description || ""} onChange={handleChange} className="w-3/4 p-2 border rounded-md" rows="3" />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-right font-semibold text-gray-700">Danh mục:</label>
          <select name="categoryId" value={product.categoryId || ""} onChange={handleChange} className="w-3/4 p-2 border rounded-md">
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-right font-semibold text-gray-700">Ảnh hiện tại:</label>
          <img src={newImagePreview || currentImageUrl || PLACEHOLDER_IMG} alt="Ảnh sản phẩm" className="h-24 w-24 object-cover rounded-md border" onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)} />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-right font-semibold text-gray-700">Thay đổi ảnh:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-3/4 p-2 border rounded-md file:bg-blue-50 file:text-blue-700 file:rounded-full hover:file:bg-blue-100" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
