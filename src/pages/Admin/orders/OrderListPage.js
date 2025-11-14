// src/pages/Admin/orders/OrderListPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Pagination from "../../../components/Pagination";
import adminOrderService from "../../../services/Admin/orderService";

const fmtMoney = (n) =>
  (n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const fmtDateTime = (s) => (s ? new Date(s).toLocaleString("vi-VN") : "");

export default function OrderListPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  // ===== Load dữ liệu =====
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await adminOrderService.getAll(); // trả về mảng OrderDto
        const sorted =
          (Array.isArray(data) ? data : []).slice().sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tb - ta; // mới nhất lên đầu
          });

        setAllOrders(sorted);
        setFilteredOrders(sorted);
      } catch (err) {
        console.error(err);
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Không tải được danh sách đơn hàng.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ===== Filter theo từ khoá =====
  useEffect(() => {
    let result = allOrders;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((o) => {
        const idText = `#${o.id}`;
        return (
          idText.toLowerCase().includes(q) ||
          (o.name || "").toLowerCase().includes(q) ||
          (o.phone || "").toLowerCase().includes(q) ||
          (o.email || "").toLowerCase().includes(q)
        );
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchTerm, allOrders]);

  const handleReset = () => {
    setSearchTerm("");
  };

  // ===== Phân trang =====
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold w-full">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Header + tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Quản lý Đơn hàng</h2>
      </div>

      {/* Thanh tìm kiếm / filter */}
      <div className="flex items-center space-x-4 mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="relative flex-grow">
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
            placeholder="Tìm theo mã đơn, tên, điện thoại, email..."
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

      {/* Bảng đơn hàng */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600">Chưa có đơn hàng nào.</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Mã đơn
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Liên hệ
                  </th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">
                    Ngày tạo
                  </th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase">
                    Tổng tiền
                  </th>
                  <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-900 font-semibold">
                      #{o.id}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-900">
                      <div className="font-medium">{o.name}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {o.address}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      <div className="text-xs">📞 {o.phone}</div>
                      <div className="text-xs">✉️ {o.email}</div>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      {fmtDateTime(o.createdAt)}
                    </td>

                    <td className="py-4 px-6 text-sm text-right font-semibold text-gray-900">
                      {fmtMoney(o.totalAmount)}
                    </td>

                    <td className="py-4 px-6 text-sm text-center">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <Pagination
            itemsPerPage={ordersPerPage}
            totalItems={filteredOrders.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
}
