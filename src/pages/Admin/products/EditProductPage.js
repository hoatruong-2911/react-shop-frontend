import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import productService from "../../../services/Admin/productService";
import categoryService from "../../../services/Admin/categoryService";
import brandService from "../../../services/Admin/brandService";

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
    brandId: "",
    imageUrl: "",
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load product + category + brand
  useEffect(() => {
    (async () => {
      try {
        const [prodRes, cateRes, brandRes] = await Promise.all([
          productService.getProductById(id),
          categoryService.getAllCategories(),
          brandService.getAllBrands(),
        ]);

        setProduct(prodRes.data || {});
        setCategories(cateRes.data || []);
        setBrands(brandRes.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        toast.error("Không thể tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const currentImageUrl = useMemo(
    () => toImageSrc(product),
    [product?.imageUrl]
  );

  const newImagePreview = useMemo(
    () => (newImageFile ? URL.createObjectURL(newImageFile) : ""),
    [newImageFile]
  );

  useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  const handleChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setNewImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updated = {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
      categoryId: Number(product.categoryId),
      brandId: Number(product.brandId),
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

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold w-full py-12">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 text-center">
        ✏️ Chỉnh sửa Sản Phẩm (ID: {id})
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10 w-full">
        
        {/* ==== HÀNG 1: ẢNH - TÊN - DANH MỤC ==== */}
        <div className="grid grid-cols-3 gap-6 w-full">
          
          {/* Ảnh */}
          <div className="border rounded-2xl p-4 shadow-sm flex flex-col items-center">
            <h3 className="font-semibold text-gray-700 mb-3 text-center">
              Ảnh sản phẩm
            </h3>

            <img
              src={newImagePreview || currentImageUrl || PLACEHOLDER_IMG}
              alt="Ảnh sản phẩm"
              className="h-32 w-32 object-cover rounded-md border mb-3"
              onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm w-full p-2 border rounded-md"
            />
          </div>

          {/* Tên sản phẩm */}
          <div className="border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3">Tên sản phẩm</h3>
            <input
              type="text"
              name="name"
              value={product.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Danh mục */}
          <div className="border rounded-2xl p-4 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">Danh mục</h3>
            <select
              name="categoryId"
              value={product.categoryId || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
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
              value={product.price ?? 0}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Số lượng */}
          <div className="border rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-3">Số lượng</h3>
            <input
              type="number"
              name="quantity"
              value={product.quantity ?? 0}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Thương hiệu */}
          <div className="border rounded-2xl p-4 shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">Thương hiệu</h3>
            <select
              name="brandId"
              value={product.brandId || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">-- Chọn thương hiệu --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ==== HÀNG 3: MÔ TẢ ==== */}
        <div className="border rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Mô tả</h3>
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* ===== BUTTON ===== */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-10 rounded-lg shadow-md"
          >
            💾 Lưu thay đổi
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProductPage;
