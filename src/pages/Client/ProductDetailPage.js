import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/Client/productService';
import { toast } from 'react-toastify';
import { ChevronRight, ShoppingCart, Minus, Plus, CheckCircle, Shield } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

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
  typeof price !== 'number'
    ? 'N/A'
    : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct]   = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading]   = useState(true);
  const { addToCart } = useCart();

  // ====== STATE CHO ĐÁNH GIÁ ======
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  // ====== LOAD PRODUCT ======
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        const p = res.data;
        p.imageUrl = normFileUrl(p.imageUrl);
        setProduct(p);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        toast.error("Không tìm thấy sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // ====== LOAD REVIEWS ======
  useEffect(() => {
    if (!id) return;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        // hàm này bạn đã thêm trong Client/productService.js
        const res = await productService.getProductReviews(id);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (product && newQuantity > product.quantity) {
        toast.warn(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
        return product.quantity;
      }
      return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
  };

  // ====== GỬI ĐÁNH GIÁ ======
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.warn("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      toast.warn("Vui lòng chọn số sao từ 1 đến 5");
      return;
    }
    if (!reviewComment.trim()) {
      toast.warn("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setSubmittingReview(true);
      const payload = {
        rating: reviewRating,
        comment: reviewComment.trim(),
      };
      await productService.createProductReview(id, payload);
      toast.success("Cảm ơn bạn đã đánh giá!");

      setReviewComment("");
      setReviewRating(5);

      const res = await productService.getProductReviews(id);
      setReviews(res.data || []);
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Không thể gửi đánh giá. Có thể bạn chưa mua sản phẩm này.";
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-6 py-12 text-center">Đang tải chi tiết sản phẩm...</div>
  );
  if (!product) return (
    <div className="container mx-auto px-6 py-12 text-center">Không tìm thấy sản phẩm.</div>
  );

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="font-medium text-gray-700">{product.name}</span>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* IMAGE */}
          <div>
            <img
              src={product.imageUrl || 'https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image'}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md border"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image';
              }}
            />
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>

            <div className="mb-6">
              <span className="text-4xl font-bold text-red-600">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || "Sản phẩm chưa có mô tả chi tiết."}
            </p>

            <div className="border-t border-b py-6 mb-6 space-y-4">

              {/* SỐ LƯỢNG */}
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-28">Số lượng:</span>
                <div className="flex items-center border rounded-md">
                  <button onClick={() => handleQuantityChange(-1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md" disabled={quantity <= 1}><Minus size={16} /></button>
                  <input type="text" value={quantity} readOnly className="w-16 text-center border-l border-r py-2" />
                  <button onClick={() => handleQuantityChange(1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md" disabled={product.quantity === 0 || quantity >= product.quantity}><Plus size={16} /></button>
                </div>
                <span className="text-gray-500 text-sm ml-4">({product.quantity} sản phẩm có sẵn)</span>
              </div>

              {/* DANH MỤC */}
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-28">Danh mục:</span>
                <Link to={`/products?category=${product.categoryId}`} className="text-blue-600 hover:underline">
                  {product.categoryName || 'Chưa phân loại'}
                </Link>
              </div>

              {/* THƯƠNG HIỆU */}
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-28">Thương hiệu:</span>
                <Link
                  to={`/products?brand=${product.brandId}`}
                  className="text-blue-600 hover:underline"
                >
                  {product.brandName || "Không rõ"}
                </Link>
              </div>

              {/* TÌNH TRẠNG */}
              <div className="flex items-center">
                <span className="font-semibold text-gray-700 w-28">Tình trạng:</span>
                {product.quantity > 0 ? (
                  <span className="text-green-600 font-semibold">Còn hàng</span>
                ) : (
                  <span className="text-red-600 font-semibold">Hết hàng</span>
                )}
              </div>

            </div>

            {/* ADD TO CART */}
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={22} /> Thêm vào giỏ hàng
            </button>

            {/* CAM KẾT */}
            <div className="mt-8 space-y-3 text-gray-600">
              <div className="flex items-center gap-3"><Shield size={20} className="text-blue-500" /><span>Bảo hành chính hãng 12 tháng.</span></div>
              <div className="flex items-center gap-3"><CheckCircle size={20} className="text-green-500" /><span>Cam kết hàng mới 100% (Fullbox).</span></div>
            </div>

          </div>
        </div>

        {/* ĐÁNH GIÁ SẢN PHẨM */}
        <div className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

          {/* FORM ĐÁNH GIÁ */}
          <div className="bg-gray-50 border rounded-lg p-5 mb-8">
            {isLoggedIn ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Số sao</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="border rounded px-3 py-2"
                  >
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} sao
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nhận xét</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                >
                  {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                </button>

                <p className="text-xs text-gray-500 mt-1">
                  * Hệ thống chỉ chấp nhận đánh giá từ khách đã mua sản phẩm này.
                </p>
              </form>
            ) : (
              <p className="text-gray-700">
                Vui lòng{" "}
                <Link to="/login" className="text-blue-600 underline">
                  đăng nhập
                </Link>{" "}
                để đánh giá sản phẩm.
              </p>
            )}
          </div>

          {/* DANH SÁCH ĐÁNH GIÁ */}
          {reviewsLoading ? (
            <div className="text-gray-500">Đang tải đánh giá...</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-500">
              Chưa có đánh giá nào cho sản phẩm này.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold">
                      {r.userName || "Người dùng"}
                    </div>
                    <div className="text-yellow-500 text-sm">
                      {"★".repeat(r.rating)}{" "}
                      <span className="text-gray-500">
                        ({r.rating}/5)
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {r.comment}
                  </p>
                  {r.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SẢN PHẨM LIÊN QUAN */}
        <div className="mt-20 border-t pt-12">
          <h2 className="text-3xl font-bold text-center mb-10">Sản phẩm liên quan</h2>
          <div className="text-center text-gray-500">(Chức năng đang được phát triển)</div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
