import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/Client/ProductCard";
import ClientProductService from "../../services/Client/productService";
import ClientCategoryService from "../../services/Client/categoryService";
import ClientBrandService from "../../services/Client/brandService";
import ClientBannerService from "../../services/Client/bannerService";
import ClientPostService from "../../services/Client/postService";

/* ===== Chuẩn hoá URL ảnh ===== */
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN = API_BASE.replace(/\/api\/?$/, "");

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

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [mainBanners, setMainBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [posts, setPosts] = useState([]);

  // ⭐ HOMEPAGE TOP BANNER
  const [topBanners, setTopBanners] = useState([]);
  const [topIndex, setTopIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================== LOAD DATA ================== */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [productRes, categoryRes, bannerRes, topBannerRes] =
          await Promise.all([
            ClientProductService.getAllProducts(),
            ClientCategoryService.getAllCategories(),
            ClientBannerService.getAllBanners("main-slider"),
            ClientBannerService.getAllBanners("homepage-top"),
          ]);

        // Products
        const mappedProducts = (productRes.data || []).map((p) => ({
          ...p,
          img: normFileUrl(p.imageUrl),
          imageUrl: normFileUrl(p.imageUrl),
        }));

        // Categories
        const mappedCategories = (categoryRes.data || []).map((c) => ({
          ...c,
          img:
            normFileUrl(c.imageUrl) ||
            `https://placehold.co/300x200/3b82f6/white?text=${encodeURIComponent(
              c.name
            )}`,
          imageUrl: normFileUrl(c.imageUrl),
        }));

        // ⭐ MAIN BANNER
        const mappedBanners = (bannerRes.data || []).map((b) => ({
          ...b,
          imageUrl: normFileUrl(b.imageUrl),
        }));

        // ⭐ HOMEPAGE-TOP BANNER
        const mappedTop = (topBannerRes.data || []).map((b) => ({
          ...b,
          imageUrl: normFileUrl(b.imageUrl),
        }));

        setProducts(mappedProducts);
        setCategories(mappedCategories.slice(0, 8));
        setMainBanners(mappedBanners);
        setTopBanners(mappedTop);

        // LOAD BRANDS
        try {
          const brandRes = await ClientBrandService.getAllBrands();
          const mappedBrands = (brandRes.data || []).slice(0, 6).map((b) => ({
            ...b,
            img: normFileUrl(b.logoUrl),
            imageUrl: normFileUrl(b.logoUrl),
          }));
          setBrands(mappedBrands);
        } catch (e) {
          console.error("Lỗi tải brand:", e);
          setBrands([]);
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu từ server.");
      } finally {
        setLoading(false);
      }

      // ⭐ Load Posts
      try {
        const postRes = await ClientPostService.getAllPosts();
        // normalize image url inside posts
        const mappedPosts = (postRes.data || []).map((p) => ({
          ...p,
          imageUrl: normFileUrl(p.imageUrl),
        }));
        setPosts(mappedPosts.slice(0, 5));
      } catch (e) {
        console.error("Lỗi tải posts:", e);
        setPosts([]);
      }
    })();
  }, []);

  /* ================== MAIN SLIDER ================== */
  const nextSlide = () => {
    setCurrentIndex((prev) =>
      mainBanners.length > 0 ? (prev + 1) % mainBanners.length : 0
    );
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? mainBanners.length - 1 : prev - 1));
  };
  useEffect(() => {
    if (mainBanners.length > 0) {
      const timer = setInterval(nextSlide, 3500);
      return () => clearInterval(timer);
    }
  }, [mainBanners]);

  /* ================== HOMEPAGE TOP AUTO SLIDE ================== */
  useEffect(() => {
    if (topBanners.length <= 1) return;
    const timer = setInterval(() => {
      setTopIndex((i) => (i + 1) % topBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [topBanners]);

  /* ================== LOADING / ERROR ================== */
  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-2xl font-semibold text-gray-700">
          Đang tải dữ liệu...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    );

  /* ================== RENDER ================== */
  return (
    <div className="bg-gray-50/50">
      {/* ⭐⭐⭐ HOMEPAGE-TOP BANNER ⭐⭐⭐ */}
      {topBanners.length > 0 && (
        <section className="w-[100%] mx-auto mt-6">
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow bg-white">
            <Link
              to={topBanners[topIndex].linkUrl || "#"}
              className="block w-full h-full"
            >
              <img
                src={topBanners[topIndex].imageUrl}
                className="w-full h-full object-cover transition-all duration-700"
                alt="homepage-top"
              />
            </Link>

            {/* Prev */}
            {topBanners.length > 1 && (
              <button
                onClick={() =>
                  setTopIndex((i) => (i - 1 + topBanners.length) % topBanners.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/80 text-gray-800 rounded-full shadow hover:bg-white"
              >
                ❮
              </button>
            )}

            {/* Next */}
            {topBanners.length > 1 && (
              <button
                onClick={() => setTopIndex((i) => (i + 1) % topBanners.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/80 text-gray-800 rounded-full shadow hover:bg-white"
              >
                ❯
              </button>
            )}
          </div>
        </section>
      )}

      {/* ================= HERO ================= */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              TECH-SHOP - Thế giới Công nghệ
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Khám phá những sản phẩm công nghệ mới nhất với giá tốt nhất.
            </p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700"
            >
              Mua ngay
            </Link>
          </div>

          {/* RIGHT - MAIN SLIDER */}
          <div className="relative w-full h-[350px] rounded-lg overflow-hidden shadow-lg">
            {mainBanners.length > 0 ? (
              <div className="relative w-full h-full">
                <Link
                  to={mainBanners[currentIndex].linkUrl || "#"}
                  className="block w-full h-full"
                >
                  <img
                    key={currentIndex}
                    src={mainBanners[currentIndex].imageUrl}
                    className="w-full h-full object transition-all duration-700"
                    alt="banner"
                  />
                </Link>

                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/80 text-gray-800 rounded-full shadow hover:bg-white"
                >
                  ❮
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white/80 text-gray-800 rounded-full shadow hover:bg-white"
                >
                  ❯
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                  {mainBanners.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i === currentIndex ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
            ) : (
              <img
                src="https://placehold.co/600x350/3b82f6/white?text=No+Banner"
                className="w-full h-full object-cover"
                alt="placeholder"
              />
            )}
          </div>
        </div>
      </section>

      {/* ================= DANH MỤC ================= */}
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
                <img src={cat.img} alt={cat.name} className="w-full h-24 object-cover rounded mb-3" />
                <h3 className="font-semibold text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BRAND ================= */}
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
                <img src={brand.img} alt={brand.name} className="h-20 mx-auto object-contain mb-3" />
                <h3 className="font-semibold text-sm truncate">{brand.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <ProductSection title="Sản phẩm nổi bật" products={products.slice(0, 4)} />
      <ProductSection title="Sản phẩm mới nhất" products={products.slice(4, 8)} />

      {/* ================= BÀI VIẾT MỚI NHẤT ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Tin tức mới nhất</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="block bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
              >
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />}

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TRẢI NGHIỆM NGƯỜI NỔI TIẾNG ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Trải nghiệm người nổi tiếng</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <img src="https://placehold.co/200x200?text=Celeb+1" className="w-32 h-32 mx-auto rounded-full object-cover mb-4" alt="Celeb 1" />
              <h3 className="font-bold text-xl mb-2">Sơn Tùng M-TP</h3>
              <p className="text-gray-600">“Thiết bị chất lượng – Giá cực tốt – Giao hàng nhanh chóng!”</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <img src="https://placehold.co/200x200?text=Celeb+2" className="w-32 h-32 mx-auto rounded-full object-cover mb-4" alt="Celeb 2" />
              <h3 className="font-bold text-xl mb-2">Độ Mixi</h3>
              <p className="text-gray-600">“Gear xịn – Uy tín – Sẽ luôn ủng hộ TECH-SHOP!”</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 text-center">
              <img src="https://placehold.co/200x200?text=Celeb+3" className="w-32 h-32 mx-auto rounded-full object-cover mb-4" alt="Celeb 3" />
              <h3 className="font-bold text-xl mb-2">Ninh Dương Lan Ngọc</h3>
              <p className="text-gray-600">“Dịch vụ tuyệt vời – sản phẩm chính hãng 100%!”</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAM KẾT CỦA CHÚNG TÔI ================= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Cam kết của TECH-SHOP</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">✔️</div>
              <h3 className="font-bold text-xl mb-2">100% Chính Hãng</h3>
              <p className="text-gray-600">Cam kết chỉ cung cấp sản phẩm chính hãng, nguyên seal.</p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2">Giao Hàng Nhanh</h3>
              <p className="text-gray-600">Ship toàn quốc với tốc độ cực nhanh.</p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-bold text-xl mb-2">Hỗ Trợ 24/7</h3>
              <p className="text-gray-600">Luôn luôn đồng hành và hỗ trợ khách hàng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ƯU ĐIỂM CỦA TECH-SHOP ================= */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Vì sao khách hàng chọn TECH-SHOP?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-3">Giá Tốt Nhất Thị Trường</h3>
              <p className="text-gray-600">Giá luôn cạnh tranh – kèm nhiều chương trình khuyến mãi hấp dẫn.</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-3">Đa Dạng Sản Phẩm</h3>
              <p className="text-gray-600">Hơn 10.000+ sản phẩm công nghệ cho mọi nhu cầu.</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-bold text-xl mb-3">Dịch Vụ Hậu Mãi Tốt</h3>
              <p className="text-gray-600">Bảo hành nhanh chóng – hỗ trợ khách hàng tận tâm.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ================= COMPONENT PRODUCT SECTION ================= */
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

export default HomePage;
