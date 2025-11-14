import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import dashboardService from "../../../services/Admin/dashboardService";

const fmtMoney = (n) =>
  (n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const fmtDateTime = (s) => (s ? new Date(s).toLocaleString("vi-VN") : "");

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getSummary();
        setData(res);
      } catch (err) {
        console.error(err);
        toast.error("Không tải được dữ liệu dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-xl font-semibold w-full">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-gray-600">Không có dữ liệu.</div>;
  }

  const { totalRevenue, totalUsers, totalProducts, totalCategories, recentOrders } =
    data;

  return (
    <div className="w-full space-y-6">
      {/* Tiêu đề */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Tổng quan hệ thống</h2>
      </div>

      {/* Hàng card thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-emerald-500">
          <div className="text-sm font-medium text-gray-500">
            Tổng doanh thu
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">
            {fmtMoney(totalRevenue)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
          <div className="text-sm font-medium text-gray-500">
            Tổng khách hàng (USER)
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">
            {totalUsers}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-indigo-500">
          <div className="text-sm font-medium text-gray-500">
            Tổng sản phẩm
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">
            {totalProducts}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500">
          <div className="text-sm font-medium text-gray-500">
            Tổng danh mục
          </div>
          <div className="mt-3 text-2xl font-bold text-gray-900">
            {totalCategories}
          </div>
        </div>
      </div>

      {/* Đơn hàng mới trong 2 ngày gần nhất */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            Đơn hàng mới trong 2 ngày gần nhất
          </h3>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            Xem tất cả đơn hàng
          </Link>
        </div>

        {(!recentOrders || recentOrders.length === 0) ? (
          <div className="text-gray-500 text-sm">
            Không có đơn hàng nào trong 2 ngày gần đây.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Mã đơn
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Khách hàng
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Thời gian
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase">
                    Tổng tiền
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      #{o.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <div className="font-medium">{o.name}</div>
                      <div className="text-xs text-gray-500">{o.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {fmtDateTime(o.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                      {fmtMoney(o.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-sm text-center">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
