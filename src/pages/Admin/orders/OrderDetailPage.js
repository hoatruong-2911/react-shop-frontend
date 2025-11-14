// src/pages/Admin/orders/OrderDetailPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import adminOrderService from "../../../services/Admin/orderService";

const fmtMoney = (n) =>
  (n || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
const fmtDateTime = (s) =>
  s ? new Date(s).toLocaleString("vi-VN") : "";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const total = useMemo(
    () => (order?.items || []).reduce((sum, it) => sum + (it.price || 0), 0),
    [order]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminOrderService.getById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
        const msg =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Không lấy được thông tin đơn hàng.";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!order) return <div className="p-6">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Đơn hàng #{order.id}
        </h1>
        <Link
          to="/admin/orders"
          className="text-blue-600 text-sm hover:underline"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      {/* Thông tin khách hàng */}
      <div className="bg-white rounded shadow border p-4">
        <h2 className="text-lg font-semibold mb-3">
          Thông tin khách hàng
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <div className="font-medium">Tên khách hàng</div>
            <div>{order.name}</div>
          </div>
          <div>
            <div className="font-medium">Số điện thoại</div>
            <div>{order.phone}</div>
          </div>
          <div>
            <div className="font-medium">Email</div>
            <div>{order.email}</div>
          </div>
          <div>
            <div className="font-medium">Ngày tạo</div>
            <div>{fmtDateTime(order.createdAt)}</div>
          </div>
          <div className="md:col-span-2">
            <div className="font-medium">Địa chỉ giao hàng</div>
            <div>{order.address}</div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded shadow border p-4">
        <h2 className="text-lg font-semibold mb-3">
          Sản phẩm trong đơn
        </h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Sản phẩm</th>
              <th className="px-3 py-2 text-center">Số lượng</th>
              <th className="px-3 py-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">
                  {it.productName} (ID: {it.productId})
                </td>
                <td className="px-3 py-2 text-center">
                  {it.quantity}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {fmtMoney(it.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right font-semibold text-base">
          Tổng tiền:{" "}
          <span className="text-red-600">{fmtMoney(total)}</span>
        </div>
      </div>
    </div>
  );
}
