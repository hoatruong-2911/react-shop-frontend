// src/pages/Client/MyOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/Client/orderService";

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await orderService.getMyOrders(); // GET /api/orders/my-orders
        setOrders(res.data || res);                  // tuỳ backend trả
      } catch (e) {
        const data = e?.response?.data;
        setErr(data?.error || data?.message || "Không tải được đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50/50 py-10">
        <div className="container mx-auto px-6">Đang tải đơn hàng...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 py-10">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>

        {err && (
          <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded">
            {err}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link to="/products" className="text-blue-600 underline mt-2 inline-block">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-lg shadow border p-5 flex flex-col gap-3"
              >
                {/* Header đơn */}
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold text-gray-800">
                      Đơn hàng #{o.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ngày đặt:{" "}
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString("vi-VN")
                        : "--"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Người nhận: {o.name} – {o.phone}
                    </div>
                    <div className="text-sm text-gray-500">
                      Địa chỉ: {o.address}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase text-gray-500">
                      Tổng tiền
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {formatMoney(o.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="mt-2">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-1">Sản phẩm</th>
                        <th className="py-1 text-center w-24">Số lượng</th>
                        <th className="py-1 text-right w-32">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(o.items || []).map((it) => (
                        <tr key={it.id} className="border-b last:border-0">
                          <td className="py-1 pr-4">
                            <span className="font-medium">{it.productName}</span>
                          </td>
                          <td className="py-1 text-center">{it.quantity}</td>
                          <td className="py-1 text-right">
                            {formatMoney(it.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
