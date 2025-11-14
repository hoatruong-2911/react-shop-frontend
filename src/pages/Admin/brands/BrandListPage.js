import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import brandService from "../../../services/Admin/brandService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";
import { toImageSrc, PLACEHOLDER_IMG } from "../../../services/utils/img";

const BrandListPage = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [brandsPerPage] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ROLE check
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await brandService.getAllBrands();

      const normalized = (res.data || [])
        .map((b) => {
          const logo = b.logoUrl || b.logo_url || b.image_url || "";
          return {
            ...b,
            logoUrl: logo,
            imageUrl: toImageSrc({ image_url: logo }),
          };
        })
        .sort((a, b) => b.id - a.id);

      setBrands(normalized);
      setFilteredBrands(normalized);
    } catch (error) {
      console.error("Load brand error:", error);
      toast.error("Không thể tải danh sách thương hiệu!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = brands;

    if (searchTerm) {
      result = result.filter((b) =>
        (b.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBrands(result);
    setCurrentPage(1);
  }, [searchTerm, brands]);

  const handleDelete = (id) => {
    if (!isAdmin) return;

    if (
      window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu có ID ${id} không?`)
    ) {
      brandService
        .deleteBrand(id)
        .then(() => {
          toast.success("Xóa thương hiệu thành công!");
          loadBrands();
        })
        .catch((err) => {
          const errorMessage =
            err?.response?.data?.message ||
            (typeof err?.response?.data === "string"
              ? err.response.data
              : null) ||
            "Xóa thất bại! Có thể vẫn còn sản phẩm thuộc thương hiệu này.";

          toast.error(errorMessage);
        });
    }
  };

  const currentBrands = filteredBrands.slice(
    (currentPage - 1) * brandsPerPage,
    currentPage * brandsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReset = () => setSearchTerm("");

  // Rendering
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
        <h2 className="text-2xl font-semibold">Danh sách Thương hiệu</h2>

        {isAdmin && (
          <Link to="/admin/add-brand">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Thêm mới
            </button>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <input
            type="text"
            placeholder="Tìm theo tên thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                Logo
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                Tên thương hiệu
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentBrands.map((brand) => (
              <tr key={brand.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-900">{brand.id}</td>

                <td className="py-4 px-6">
                  <img
                    src={brand.imageUrl || PLACEHOLDER_IMG}
                    alt={brand.name}
                    className="h-16 w-16 object-cover rounded"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                  />
                </td>

                <td className="py-4 px-6 text-sm font-medium">{brand.name}</td>

                <td className="py-4 px-6 text-sm font-medium">
                  {isAdmin ? (
                    <>
                      <Link to={`/admin/edit-brand/${brand.id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs mr-2">
                          Sửa
                        </button>
                      </Link>

                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                        onClick={() => handleDelete(brand.id)}
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
        itemsPerPage={brandsPerPage}
        totalItems={filteredBrands.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default BrandListPage;
