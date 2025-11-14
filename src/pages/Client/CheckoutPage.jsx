// src/pages/Client/CheckoutPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useCart } from "../../contexts/CartContext";
import authService from "../../services/authService";
import orderService from "../../services/Client/orderService";

export default function CheckoutPage() {
  const nav = useNavigate();
  const {
    cartItems,
    selectedItems,
    selectedCartTotal, // tổng tiền của các sản phẩm đã tick
    removeFromCart,
  } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Lọc ra các item đã tick từ giỏ
  const selectedCartItems = useMemo(
    () => cartItems.filter((x) => selectedItems.includes(x.id)),
    [cartItems, selectedItems]
  );

  // Nếu không có sản phẩm nào được chọn thì quay lại giỏ
  useEffect(() => {
    if (selectedCartItems.length === 0) {
      toast.info("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.");
      nav("/cart", { replace: true });
    }
  }, [selectedCartItems, nav]);

  // Lấy thông tin user đang đăng nhập để prefill form
  useEffect(() => {
    const loadMe = async () => {
      try {
        const me = await authService.me(); // GET /auth/me
        setForm((f) => ({
          ...f,
          name: me.name || "",
          phone: me.phone || "",
          email: me.email || "",
          address: me.address || "",
        }));
      } catch (e) {
        toast.error("Bạn cần đăng nhập để thanh toán.");
        nav("/login");
      }
    };
    loadMe();
  }, [nav]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const shippingFee = selectedCartItems.length > 0 ? 30000 : 0;
  const grandTotal = selectedCartTotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCartItems.length === 0) {
      toast.error("Không có sản phẩm nào được chọn.");
      return;
    }

    // Validate đơn giản FE
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.address.trim()
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }

    // phone: 10 số, bắt đầu bằng 0 (khớp regex Java)
    if (!/^0\d{9}$/.test(form.phone.trim())) {
      toast.error("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0.");
      return;
    }

    // Build payload OrderCreateDto
    const items = selectedCartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      items,
    };

    try {
      setLoading(true);
      await orderService.createOrder(payload); // POST /api/orders

      toast.success("Đặt hàng thành công!");

      // Xoá các sản phẩm đã thanh toán khỏi giỏ
      selectedCartItems.forEach((item) => removeFromCart(item.id));

      nav("/my-orders");
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.error || data?.message || "Đặt hàng thất bại.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/50 py-10">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: thông tin giao hàng */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold mb-6">Thông tin giao hàng</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ tên */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-800">
                Họ tên
              </label>
              <div className="flex-1">
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Nhập họ tên người nhận"
                  required
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-800">
                Số điện thoại
              </label>
              <div className="flex-1">
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Ví dụ: 0909xxxxxx"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-800">
                Email
              </label>
              <div className="flex-1">
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email nhận thông tin đơn hàng"
                  required
                />
              </div>
            </div>

            {/* Địa chỉ nhận hàng */}
            <div className="flex items-start gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-800 mt-2">
                Địa chỉ nhận hàng
              </label>
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  rows={3}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Đang xử lý..."
                : `Đặt hàng (${selectedCartItems.length} sản phẩm)`}
            </button>
          </form>

          <div className="mt-4 text-sm">
            <Link to="/cart" className="text-blue-600 hover:underline">
              ← Quay lại giỏ hàng
            </Link>
          </div>
        </div>

        {/* Cột phải: tóm tắt đơn hàng */}
        <div className="bg-white rounded-lg shadow-md p-8 h-fit">
          <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>

          <ul className="divide-y">
            {selectedCartItems.map((item) => (
              <li key={item.id} className="py-3 text-sm">
                {/* Chỉ hiển thị tên */}
                <div className="font-medium text-gray-800 mb-1">{item.name}</div>

                {/* Dòng đơn giá + số lượng */}
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Đơn giá: {(item.price || 0).toLocaleString("vi-VN")} ₫</span>
                  <span>SL: {item.quantity}</span>
                </div>
              </li>
            ))}
          </ul>


          <div className="mt-4 border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{selectedCartTotal.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển</span>
              <span>{shippingFee.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between font-semibold text-red-600 mt-2">
              <span>Thành tiền</span>
              <span>{grandTotal.toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
