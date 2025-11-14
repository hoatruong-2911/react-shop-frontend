import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/Client/ProductCard";
import ClientProductService from "../../services/Client/productService";
import ClientCategoryService from "../../services/Client/categoryService";
import ClientBrandService from "../../services/Client/brandService"; // ✅ THÊM IMPORT

/* ===== Chuẩn hoá URL ảnh (dùng chung) ===== */
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
  if (v.startsWith("files/")) return `${API_BASE}/${v}`;
  if (!v.includes("/")) return `${API_BASE}/files/${v}`;

  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}

/* ========================================= */

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]); // ✅ THÊM STATE BRAND
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const news = [
    { id: 1, title: "Đánh giá iPhone 16 Pro Max: Titan, Chip A18 Pro, Camera 5x", excerpt: "Những nâng cấp đáng giá trên thế hệ iPhone mới nhất của Apple...", img: "https://placehold.co/400x250/dbeafe/1e3a8a?text=Tin+T%E1%BB%A9c+1" },
    { id: 2, title: "MacBook Pro M4 ra mắt: Hiệu năng đồ họa vượt trội", excerpt: "Chip M4 mới mang lại khả năng xử lý AI và đồ họa chưa từng có...", img: "https://placehold.co/400x250/dbeafe/1e3a8a?text=Tin+T%E1%BB%A9c+2" },
    { id: 3, title: "So sánh Galaxy S25 Ultra và iPhone 16 Pro Max", excerpt: "Cuộc đối đầu không hồi kết của hai ông lớn làng smartphone...", img: "https://placehold.co/400x250/dbeafe/1e3a8a?text=Tin+T%E1%BB%A9c+3" },
  ];

  const testimonials = [
    { id: 1, name: "Tech Reviewer - Tinh Tế", quote: "Sản phẩm chính hãng, giá tốt. Tôi luôn tin tưởng mua hàng tại TECH-SHOP." },
    { id: 2, name: "Gamer - Độ Mixi", quote: "Gear gaming chất lượng, giao hàng nhanh." },
    { id: 3, name: "Lập trình viên - Hoàng", quote: "Mua MacBook M4 rất hài lòng. Dịch vụ tư vấn chuyên nghiệp." },
  ];

  /* ----------------------------- LOAD DATA ----------------------------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [productRes, categoryRes] = await Promise.all([
          ClientProductService.getAllProducts(),
          ClientCategoryService.getAllCategories(),
        ]);

        const mappedProducts = (productRes.data || []).map((p) => ({
          ...p,
          img: normFileUrl(p.imageUrl),
          imageUrl: normFileUrl(p.imageUrl),
        }));

        const mappedCategories = (categoryRes.data || []).map((c) => ({
          ...c,
          img: normFileUrl(c.imageUrl) || `https://placehold.co/300x200/3b82f6/white?text=${encodeURIComponent(c.name)}`,
          imageUrl: normFileUrl(c.imageUrl),
        }));

        setProducts(mappedProducts);
        setCategories(mappedCategories);

        // ⭐ LOAD BRAND (KHÔNG ĐỤNG LOGIC CŨ)
        try {
          const brandRes = await ClientBrandService.getAllBrands();
          const mappedBrands = (brandRes.data || [])
            .slice(0, 6) // chỉ lấy 6 brand
            .map((b) => ({
              ...b,
              img: normFileUrl(b.logoUrl),
              imageUrl: normFileUrl(b.logoUrl),
            }));
          setBrands(mappedBrands);
        } catch (e) {
          console.error("Lỗi tải brand:", e);
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu từ server.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ----------------------------- UI STATES ----------------------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-2xl font-semibold text-gray-700">Đang tải dữ liệu...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50">

      {/* Hero */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">TECH-SHOP - Thế giới Công nghệ</h1>
            <p className="text-gray-600 text-lg mb-8">Khám phá những sản phẩm công nghệ mới nhất với giá tốt nhất.</p>
            <Link to="/products" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700">
              Mua ngay
            </Link>
          </div>
          <img
            src="https://placehold.co/600x400/3b82f6/white?text=Hero+Image"
            alt="Hero"
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Danh mục nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden group text-center p-4 hover:shadow-xl transition-shadow"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-24 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ THƯƠNG HIỆU NỔI BẬT */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Thương hiệu nổi bật</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/products?brand=${brand.id}`}
                className="block bg-gray-50 p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="h-20 mx-auto object-contain mb-3"
                />
                <h3 className="font-semibold text-sm truncate">{brand.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <ProductSection title="Sản phẩm nổi bật" products={products.slice(0, 4)} />

      {/* Sản phẩm mới nhất */}
      <ProductSection title="Sản phẩm mới nhất" products={products.slice(4, 8)} />

      {/* Tin tức */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Tin tức công nghệ</h2>
          <p className="text-gray-600 text-center mb-10">
            Cập nhật tin tức và đánh giá sản phẩm mới nhất
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Phản hồi của khách hàng</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

/* ==== Components con ==== */

const ProductSection = ({ title, products }) => (
  <section className="py-16">
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Link to="/products" className="text-blue-600 font-semibold hover:underline">
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  </section>
);

const NewsCard = ({ title, excerpt, img }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img src={img} alt={title} className="w-full h-48 object-cover" />
    <div className="p-5">
      <h3 className="font-semibold text-xl mb-3 h-20 overflow-hidden">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">{excerpt}</p>
      <Link
        to="/news/1"
        className="text-blue-600 font-semibold border border-blue-600 rounded-full py-2 px-5 hover:bg-blue-600 hover:text-white"
      >
        Chi tiết
      </Link>
    </div>
  </div>
);

const TestimonialCard = ({ name, quote }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center h-full">
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <h4 className="font-semibold text-lg">{name}</h4>
  </div>
);

export default HomePage;
