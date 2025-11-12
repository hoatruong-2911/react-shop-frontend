import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../../services/Admin/productService";
import categoryService from "../../../services/Admin/categoryService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";
import { toImageSrc, PLACEHOLDER_IMG } from "../../../services/utils/img";

const ProductListPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // ADMIN chỉ định quyền hiển thị nút
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsRes = await productService.getAllProducts();
      const categoriesRes = await categoryService.getAllCategories();

      const sortedProducts = (productsRes.data || [])
        .map((p) => ({ ...p, imageUrl: toImageSrc(p) }))
        .sort((a, b) => b.id - a.id);

      setAllProducts(sortedProducts);
      setFilteredProducts(sortedProducts);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu từ server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = allProducts;
    if (searchTerm) {
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === parseInt(selectedCategory));
    }
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, allProducts]);

  const handleDelete = (id) => {
    if (!isAdmin) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm có ID ${id} không?`)) {
      productService
        .deleteProduct(id)
        .then((response) => {
          toast.success(response?.data?.message || "Xóa sản phẩm thành công!");
          loadData();
        })
        .catch(() => {
          toast.error("Xóa sản phẩm thất bại!");
        });
    }
  };

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold w-full">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Sản phẩm</h2>

        {isAdmin && (
          <Link to="/admin/add-product">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Thêm mới
            </button>
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Tên SP</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Giá bán</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Chi tiết</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-900">{product.id}</td>

                <td className="py-4 px-6">
                  <img
                    src={product.imageUrl || PLACEHOLDER_IMG}
                    alt={product.name}
                    className="h-16 w-16 object-cover rounded"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                  />
                </td>

                <td className="py-4 px-6 text-sm text-gray-900 font-medium">{product.name}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{product.categoryName}</td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {(product.price ?? 0).toLocaleString()}đ
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">{product.quantity}</td>
                <td className="py-4 px-6 text-sm text-gray-500">{product.description}</td>

                <td className="py-4 px-6 text-sm font-medium">
                  {isAdmin ? (
                    <>
                      <Link to={`/admin/edit-product/${product.id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs mr-2">
                          Sửa
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                        onClick={() => handleDelete(product.id)}
                      >
                        Xóa
                      </button>
                    </>
                  ) : (
                    <span className="opacity-60">Chỉ xem</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        itemsPerPage={productsPerPage}
        totalItems={filteredProducts.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default ProductListPage;
