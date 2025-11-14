import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN   = API_BASE.replace(/\/api\/?$/, "");

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
    } catch {}
  }

  if (v.startsWith("/api/files/")) return `${ORIGIN}${v}`;
  if (v.startsWith("/files/")) return `${API_BASE}${v}`;
  if (v.startsWith("files/"))  return `${API_BASE}/${v}`;
  if (!v.includes("/")) return `${API_BASE}/files/${v}`;

  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}

const formatPrice = (price) =>
  (typeof price !== 'number' || isNaN(price)) ? ""
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProductCard = (props) => {
  const { addToCart } = useCart();

  const { id, name, price, oldPrice, discount, img, imageUrl, categoryName, quantity } = props;

  const src = normFileUrl(imageUrl || img);
  const safeSrc = src || `https://placehold.co/300x300/e0e7ff/1e3a8a?text=${encodeURIComponent(name || 'Product')}`;

  if (!id || !name) {
    console.warn("ProductCard received incomplete props:", props);
    return null;
  }

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productToAdd = { id, name, price, imageUrl: safeSrc, quantity };
    addToCart(productToAdd, 1);
    toast.success(`Đã thêm "${name}" vào giỏ!`);
  };

  return (
    <Link
      to={`/product/${id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden group relative border border-transparent hover:border-blue-500 hover:shadow-xl transition-all h-full flex flex-col"
    >
      {discount && (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
          {discount}
        </span>
      )}

      {categoryName && (
        <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded z-10">
          {categoryName}
        </span>
      )}

      <div className="overflow-hidden h-56">
        <img
          src={safeSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `https://placehold.co/300x300/e0e7ff/1e3a8a?text=${encodeURIComponent(name || 'Error')}`;
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="font-semibold text-lg mb-2 min-h-[48px] max-h-[48px] overflow-hidden text-gray-800 group-hover:text-blue-600">
          {name}
        </h3>

        <div className="flex flex-col items-start gap-1 mt-2">
          <span className="font-bold text-red-600 text-xl">{formatPrice(price)}</span>
          {oldPrice && <span className="text-gray-500 line-through text-sm">{formatPrice(oldPrice)}</span>}
        </div>
      </div>

      <button
        onClick={handleAddToCartClick}
        className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-20 disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label={`Thêm ${name} vào giỏ hàng`}
        disabled={quantity === 0}
      >
        <ShoppingCart size={20} />
      </button>

      {quantity === 0 && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 pointer-events-none">
          <span className="font-semibold text-red-600 border border-red-600 px-3 py-1 rounded-full">
            Hết hàng
          </span>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;
