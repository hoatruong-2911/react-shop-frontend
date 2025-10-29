import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import categoryService from "../../../services/Admin/categoryService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    categoryService
      .getAllCategories()
      .then((response) => {
        const sortedData = response.data.sort((a, b) => a.id - b.id);
        setCategories(sortedData);
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra khi lấy dữ liệu danh mục!", error);
        toast.error("Không thể tải danh sách danh mục!");
      });
  };

  const handleDelete = (id) => {
    // CẢNH BÁO: window.confirm() có thể không hoạt động tốt
    // Bạn nên thay thế bằng một modal xác nhận sau
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa danh mục có ID ${id} không?`)
    ) {
      categoryService
        .deleteCategory(id)
        .then(() => {
          toast.success("Xóa danh mục thành công!");
          fetchCategories();
        })
        .catch((err) => {
          toast.error(
            "Xóa thất bại! Có thể vẫn còn sản phẩm trong danh mục này."
          );
        });
    }
  };

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    // 1. THÊM w-full VÀO ĐÂY
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Danh mục</h2>
        {/* 2. SỬA ĐƯỜNG DẪN LINK */}
        <Link to="/admin/add-category">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
            + Thêm mới
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên danh mục
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-900">
                  {category.id}
                </td>
                <td className="py-4 px-6">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {category.name}
                </td>
                <td className="py-4 px-6 text-sm font-medium">
                  {/* 3. SỬA ĐƯỜNG DẪN LINK */}
                  <Link to={`/admin/edit-category/${category.id}`}>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs mr-2">
                      Sửa
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                    onClick={() => handleDelete(category.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={categories.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default CategoryListPage;
