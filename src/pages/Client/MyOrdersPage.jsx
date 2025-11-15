// src/pages/Client/MyOrdersPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/Client/orderService";
import productService from "../../services/Client/productService";
import { toast } from "react-toastify";

const formatMoney = (v) =>
  (v || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ====== STATE CHO FORM ĐÁNH GIÁ ======
  const [reviewTarget, setReviewTarget] = useState(null); // {productId, productName, orderId}
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

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

  // mở form đánh giá cho 1 sản phẩm trong đơn
  const handleOpenReview = (order, item) => {
    console.log("ITEM CLICK REVIEW:", item);

    const pid =
      item.productId ??
      item.product_id ??
      item.product?.id ??
      null;

    if (!pid) {
      toast.error("Không tìm được productId trong dữ liệu đơn hàng.");
      return;
    }

    setReviewTarget({
      productId: pid,
      productName: item.productName,
      orderId: order.id,
    });
    setReviewRating(5);
    setReviewComment("");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewTarget) return;

    if (!reviewComment.trim()) {
      toast.warn("Vui lòng nhập nội dung đánh giá");
      return;
    }
    if (reviewRating < 1 || reviewRating > 5) {
      toast.warn("Số sao phải từ 1 đến 5");
      return;
    }

    try {
      setSubmittingReview(true);
      await productService.createProductReview(reviewTarget.productId, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      toast.success(
        `Đã gửi đánh giá cho "${reviewTarget.productName}" (đơn #${reviewTarget.orderId})`
      );
      setReviewTarget(null);
      setReviewComment("");
      setReviewRating(5);
    } catch (e) {
      console.error("Lỗi gửi đánh giá:", e);
      const data = e?.response?.data;
      const msg =
        data?.message ||
        data?.error ||
        "Không thể gửi đánh giá. Có thể bạn chưa mua sản phẩm này.";
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

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
                        <th className="py-1 text-center w-32">Đánh giá</th>
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
                          <td className="py-1 text-center">
                            <button
                              type="button"
                              className="text-blue-600 hover:underline text-xs"
                              onClick={() => handleOpenReview(o, it)}
                            >
                              Viết đánh giá
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FORM ĐÁNH GIÁ NGAY DƯỚI ĐƠN NÀY */}
                {reviewTarget && reviewTarget.orderId === o.id && (
                  <div className="mt-4">
                    <div className="bg-gray-50 border rounded-lg p-4 max-w-xl">
                      <div className="flex justify-between items-center mb-2">
                        <h2 className="font-semibold text-gray-800 text-sm">
                          Đánh giá sản phẩm:{" "}
                          <span className="text-blue-700">
                            {reviewTarget.productName}
                          </span>
                        </h2>
                        <button
                          type="button"
                          className="text-xs text-gray-500 hover:text-gray-700"
                          onClick={() => setReviewTarget(null)}
                        >
                          Đóng
                        </button>
                      </div>

                      <form onSubmit={handleSubmitReview} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Số sao
                          </label>
                          <select
                            value={reviewRating}
                            onChange={(e) =>
                              setReviewRating(Number(e.target.value))
                            }
                            className="border rounded px-3 py-2 text-sm"
                          >
                            {[5, 4, 3, 2, 1].map((s) => (
                              <option key={s} value={s}>
                                {s} sao
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Nội dung đánh giá
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) =>
                              setReviewComment(e.target.value)
                            }
                            rows={3}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Sản phẩm dùng tốt / không tốt ở điểm nào..."
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-60"
                          >
                            {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                          </button>
                          <span className="text-xs text-gray-500">
                            Hệ thống chỉ chấp nhận đánh giá với sản phẩm bạn đã
                            mua.
                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
