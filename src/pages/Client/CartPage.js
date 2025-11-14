// src/pages/Client/CartPage.jsx
import React from "react";
import { useCart } from "../../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom"; // 👈 THÊM useNavigate
import { Minus, Plus, Trash2, ChevronRight, ShoppingCart } from "lucide-react";

/* ===== Chuẩn hoá URL ảnh (dùng chung) ===== */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN = API_BASE.replace(/\/api\/?$/, "");
const PLACEHOLDER = "https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Image";

function normFileUrl(val) {
  if (!val) return "";
  let v = String(val).trim().replace(/\\/g, "/");

  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      if (u.origin === ORIGIN && u.pathname.startsWith("/files/")) {
        return `${ORIGIN}/api${u.pathname}`;
      }
      return v;
    } catch {
      // ignore
    }
  }

  if (v.startsWith("/api/files/")) return `${ORIGIN}${v}`;
  if (v.startsWith("/files/")) return `${API_BASE}${v}`;
  if (v.startsWith("files/")) return `${API_BASE}/${v}`;
  if (!v.includes("/")) return `${API_BASE}/files/${v}`;
  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}

function getItemImage(item) {
  const v = item?.imageUrl || item?.image || item?.thumbnail || item?.avatarUrl || "";
  const u = normFileUrl(v);
  return u || PLACEHOLDER;
}

const formatPrice = (price) => {
  if (typeof price !== "number" || isNaN(price)) {
    return "N/A";
  }
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};

// --- COMPONENT CON: Hàng sản phẩm trong giỏ ---
const CartItemRow = ({ item, updateQuantity, removeFromCart, isSelected, toggleSelectItem }) => {
  const handleQuantityChange = (amount) => {
    const newQuantity = item.quantity + amount;
    updateQuantity(item.id, Math.max(1, newQuantity));
  };

  const handleRemove = () => {
    if (window.confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
      removeFromCart(item.id);
    }
  };

  return (
    <div className={`flex items-center py-5 border-b ${isSelected ? "bg-blue-50/30" : ""}`}>
      {/* Checkbox */}
      <div className="w-1/12 flex justify-center px-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectItem(item.id)}
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>

      {/* Sản phẩm */}
      <div className="w-5/12 flex items-center pr-4">
        <img
          src={getItemImage(item)}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg mr-4 border"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
        <div>
          <Link
            to={`/product/${item.id}`}
            className="font-semibold text-lg text-gray-800 hover:text-blue-600 line-clamp-2"
          >
            {item.name}
          </Link>
          <button
            onClick={handleRemove}
            className="text-red-500 text-sm hover:underline mt-1 flex items-center gap-1"
          >
            <Trash2 size={14} /> Xóa
          </button>
        </div>
      </div>

      {/* Giá */}
      <div className="w-2/12 text-center">
        <span className="text-gray-700">{formatPrice(item.price)}</span>
      </div>

      {/* Số lượng */}
      <div className="w-2/12 flex justify-center">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50"
            disabled={item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <input
            type="text"
            value={item.quantity}
            readOnly
            className="w-12 text-center border-l border-r py-2"
          />
          <button
            onClick={() => handleQuantityChange(1)}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Tổng cộng */}
      <div className="w-2/12 text-center font-semibold text-gray-800">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH: Trang Giỏ Hàng ---
const CartPage = () => {
  const {
    cartItems,
    selectedItems,
    updateQuantity,
    removeFromCart,
    selectedCartTotal,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected,
  } = useCart();

  const navigate = useNavigate(); // 👈 THÊM DÒNG NÀY

  const shippingFee = selectedItems.length > 0 ? 30000 : 0;
  const finalTotal = selectedCartTotal + shippingFee;

  return (
    <div className="bg-gray-50/50 py-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-medium text-gray-700">Giỏ hàng</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-lg shadow-md border">
            <ShoppingCart size={60} className="mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ.</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cột 1 */}
            <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border">
              <div className="flex items-center pb-4 border-b text-left text-sm font-semibold text-gray-500 uppercase">
                <div className="w-1/12 flex justify-center px-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="w-5/12 pr-4">Sản phẩm</div>
                <div className="w-2/12 text-center">Giá</div>
                <div className="w-2/12 text-center">Số lượng</div>
                <div className="w-2/12 text-center">Tổng cộng</div>
              </div>

              <div>
                {cartItems.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    isSelected={selectedItems.includes(item.id)}
                    toggleSelectItem={toggleSelectItem}
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <Link to="/products" className="text-blue-600 font-semibold hover:underline">
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>

            {/* Cột 2: Tóm tắt đơn hàng */}
            <div className="lg:col-span-1 h-fit bg-white p-8 rounded-lg shadow-md border sticky top-24">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tạm tính ({selectedItems.length} sản phẩm):
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatPrice(selectedCartTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vận chuyển:</span>
                  <span className="font-medium text-gray-800">{formatPrice(shippingFee)}</span>
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between">
                  <span className="font-bold text-xl">Thành tiền:</span>
                  <span className="font-bold text-xl text-red-600">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                className="mt-8 w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={selectedItems.length === 0}
                onClick={() => navigate("/checkout")}
              >
                Tiến hành thanh toán ({selectedItems.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
