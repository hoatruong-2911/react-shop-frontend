// src/pages/Admin/reviews/ReviewListPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminReviewService from "../../../services/Admin/reviewService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";

const formatDateTime = (val) => {
  if (!val) return "--";
  return new Date(val).toLocaleString("vi-VN");
};

const ReviewListPage = () => {
  const [allReviews, setAllReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | INACTIVE
  const [loading, setLoading] = useState(true);

  const [selectedReview, setSelectedReview] = useState(null);

  // Role check
  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await AdminReviewService.getAllReviews();
      const list = (res.data || []).sort((a, b) => b.id - a.id); // mới nhất lên đầu
      setAllReviews(list);
      setFilteredReviews(list);
    } catch (err) {
      console.error("Lỗi tải reviews:", err);
      toast.error("Không thể tải danh sách đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  // Lọc theo search + trạng thái
  useEffect(() => {
    let result = allReviews;

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter((r) => {
        const userName = (r.userName || "").toLowerCase();
        const comment = (r.comment || "").toLowerCase();
        const productIdStr = String(r.productId || "");
        const productName = (r.productName || "").toLowerCase(); // ✅ thêm
        return (
          userName.includes(s) ||
          comment.includes(s) ||
          productIdStr.includes(s) ||
          productName.includes(s) // ✅ search theo tên sản phẩm
        );
      });
    }

    if (statusFilter === "ACTIVE") {
      result = result.filter((r) => r.active === true);
    } else if (statusFilter === "INACTIVE") {
      result = result.filter((r) => r.active === false);
    }

    setFilteredReviews(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, allReviews]);

  const handleDelete = (id) => {
    if (!isAdmin) return;

    if (!window.confirm(`Bạn chắc chắn muốn xoá đánh giá ID ${id}?`)) {
      return;
    }

    AdminReviewService.deleteReview(id)
      .then((res) => {
        toast.success(
          res?.data?.message || `Đã xoá review ID ${id} thành công.`
        );
        if (selectedReview && selectedReview.id === id) {
          setSelectedReview(null);
        }
        loadData();
      })
      .catch((err) => {
        console.error("Lỗi xoá review:", err);
        toast.error("Không thể xoá đánh giá!");
      });
  };

  // Pagination
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold w-full">
        Đang tải dữ liệu đánh giá...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quản lý Đánh giá sản phẩm</h2>
        <span className="text-sm text-gray-500">
          Tổng: {allReviews.length} đánh giá
        </span>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
        {/* Search */}
        <div className="relative flex-grow min-w-[220px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
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
            placeholder="Tìm theo user, nội dung, ID / tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hiển thị</option>
          <option value="INACTIVE">Đã ẩn</option>
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("ALL");
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Sản phẩm
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Người dùng
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Rating
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Thời gian
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {currentReviews.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-4 text-center text-sm text-gray-500"
                >
                  Không có đánh giá nào phù hợp.
                </td>
              </tr>
            ) : (
              currentReviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{r.id}</td>

                  {/* SẢN PHẨM */}
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {r.productName || "(Không rõ tên sản phẩm)"}
                      </span>
                      <span className="text-xs text-gray-500">
                        ID: #{r.productId || "-"}
                      </span>
                      {r.productId && (
                        <Link
                          to={`/products/${r.productId}`}
                          className="text-xs text-blue-600 hover:underline mt-1"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Xem sản phẩm
                        </Link>
                      )}
                    </div>
                  </td>

                  {/* NGƯỜI DÙNG */}
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{r.userName || "N/A"}</span>
                      <span className="text-xs text-gray-500">
                        ID user: {r.userId ?? "-"}
                      </span>
                    </div>
                  </td>

                  {/* RATING */}
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <span className="text-yellow-500">
                      {"★".repeat(r.rating || 0)}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                      ({r.rating || 0}/5)
                    </span>
                  </td>

                  {/* TRẠNG THÁI */}
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {r.active ? (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Đang hiển thị
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-600">
                        Đã ẩn
                      </span>
                    )}
                  </td>

                  {/* THỜI GIAN */}
                  <td className="py-3 px-4 text-sm text-gray-500">
                    {formatDateTime(r.createdAt)}
                  </td>

                  {/* HÀNH ĐỘNG */}
                  <td className="py-3 px-4 text-sm font-medium space-x-2">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded text-xs"
                      onClick={() => setSelectedReview(r)}
                    >
                      Xem
                    </button>

                    {isAdmin && (
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs"
                        onClick={() => handleDelete(r.id)}
                      >
                        Xoá
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredReviews.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {/* PANEL XEM CHI TIẾT REVIEW */}
      {selectedReview && (
        <div className="mt-6 border rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">
              Chi tiết đánh giá #{selectedReview.id}
            </h3>
            <button
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedReview(null)}
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* SẢN PHẨM */}
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                Thông tin sản phẩm
              </div>
              <div>Tên: {selectedReview.productName || "(Không rõ)"}</div>
              <div>Mã sản phẩm: {selectedReview.productId ?? "-"}</div>
              {selectedReview.productId && (
                <Link
                  to={`/products/${selectedReview.productId}`}
                  className="text-blue-600 text-xs hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Mở trang sản phẩm
                </Link>
              )}
            </div>

            {/* USER */}
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                Người đánh giá
              </div>
              <div>Tên: {selectedReview.userName || "N/A"}</div>
              <div>ID user: {selectedReview.userId ?? "-"}</div>
            </div>

            {/* RATING */}
            <div>
              <div className="font-semibold text-gray-700 mb-1">Rating</div>
              <div className="text-yellow-500">
                {"★".repeat(selectedReview.rating || 0)}
                <span className="text-gray-600 text-xs ml-2">
                  ({selectedReview.rating || 0}/5)
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                Trạng thái
              </div>
              {selectedReview.active ? (
                <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                  Đang hiển thị
                </span>
              ) : (
                <span className="inline-block px-2 py-1 text-xs rounded bg-gray-200 text-gray-600">
                  Đã ẩn
                </span>
              )}
            </div>

            {/* TIME */}
            <div>
              <div className="font-semibold text-gray-700 mb-1">
                Thời gian tạo
              </div>
              <div>{formatDateTime(selectedReview.createdAt)}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold text-gray-700 mb-1">Nội dung</div>
            <div className="whitespace-pre-line bg-white border rounded p-3 text-sm">
              {selectedReview.comment || "(Không có nội dung)"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewListPage;
