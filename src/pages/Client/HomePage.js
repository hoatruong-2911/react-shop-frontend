import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from '../../components/Client/ProductCard';
// 1. Import service
import ClientProductService from '../../services/Client/productService';
import ClientCategoryService from '../../services/Client/categoryService';

// 2. Xóa hết dữ liệu tĩnh (categories, products)

const HomePage = () => {
    // 3. Thêm State
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dữ liệu tĩnh cho tin tức và phản hồi (vì chưa có API)
    const news = [
        { id: 1, title: "Đánh giá iPhone 16 Pro Max: Titan, Chip A18 Pro, Camera 5x", excerpt: "Những nâng cấp đáng giá trên thế hệ iPhone mới nhất của Apple...", img: "https://placehold.co/400x250/dbeafe/1e3a8a?text=Tin+Tức+1" },
        { id: 2, title: "MacBook Pro M4 ra mắt: Hiệu năng đồ họa vượt trội", excerpt: "Chip M4 mới mang lại khả năng xử lý AI và đồ họa chưa từng có...", img: "https://placehold.co/400x250/dbeafe/1e3a8a?text=Tin+Tức+2" },
        { id: 3, title: "So sánh Galaxy S25 Ultra và iPhone 16 Pro Max", excerpt: "Cuộc đối đầu không hồi kết của hai ông lớn làng smartphone...", img: "https://placehold.co/400x250/dbeafe/1e3a8a?text=Tin+Tức+3" },
    ];
    const testimonials = [
        { id: 1, name: "Tech Reviewer - Tinh Tế", quote: "Sản phẩm chính hãng, giá tốt. Tôi luôn tin tưởng mua hàng tại TECH-SHOP cho các video review của mình." },
        { id: 2, name: "Gamer - Độ Mixi", quote: "Gear gaming ở đây rất đa dạng, từ chuột, phím, tai nghe đều chất lượng. Giao hàng nhanh." },
        { id: 3, name: "Lập trình viên - Hoàng", quote: "Mua được chiếc MacBook M4 ưng ý với giá rất hợp lý. Dịch vụ tư vấn của shop rất chuyên nghiệp." },
    ];

    // 4. Thêm useEffect để gọi API
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Gọi API song song
                const [productRes, categoryRes] = await Promise.all([
                    ClientProductService.getAllProducts(),
                    ClientCategoryService.getAllCategories()
                ]);

                // Map dữ liệu API (image_url -> img)
                const mappedProducts = productRes.data.map(p => ({
                    ...p,
                    img: p.imageUrl // Map 'imageUrl' từ DB sang 'img'
                }));
                const mappedCategories = categoryRes.data.map(c => ({
                    ...c,
                    img: c.imageUrl || `https://placehold.co/300x200/3b82f6/white?text=${c.name}`
                }));

                setProducts(mappedProducts);
                setCategories(mappedCategories);
                setError(null);
            } catch (err) {
                setError("Không thể tải dữ liệu từ server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Chạy 1 lần khi mount

    // 5. Thêm UI cho Loading và Error
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

    // 6. Giao diện render (giữ nguyên)
    return (
        <div className="bg-gray-50/50">
            {/* 1. Hero Section */}
            <section className="bg-white">
                <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            TECH-SHOP - Thế giới Công nghệ
                        </h1>
                        <p className="text-gray-600 text-lg mb-8">
                            Khám phá những sản phẩm công nghệ mới nhất với giá tốt nhất.
                        </p>
                        <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors">
                            Mua ngay
                        </button>
                    </div>
                    <div>
                        <img
                            src="https://placehold.co/600x400/3b82f6/white?text=Hero+Image"
                            alt="Sản phẩm công nghệ"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Danh mục Section (Dùng state 'categories') */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        Danh mục nổi bật
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id} // Dùng ID
                                to={`/products?category=${cat.id}`} // Link tới trang SP với query
                                className="block bg-white rounded-lg shadow-md overflow-hidden group text-center p-4 hover:shadow-xl transition-shadow"
                            >
                                <img
                                    src={cat.img} // Đã được map ở trên
                                    alt={cat.name}
                                    className="w-full h-24 object-cover rounded mb-3"
                                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/300x200/3b82f6/white?text=${cat.name}` }}
                                />
                                <h3 className="font-semibold text-sm">{cat.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Sản phẩm nổi bật Section (Dùng state 'products') */}
            <ProductSection
                title="Sản phẩm nổi bật"
                products={products.slice(0, 4)} // Lấy 4 sản phẩm đầu
            />

            {/* 4. Laptop & Macbook Section */}
            <ProductSection
                title="Sản phẩm mới nhất"
                products={products.slice(4, 8)} // Lấy 4 sản phẩm tiếp theo
            />

            {/* 5. Tin công nghệ Section (Dùng state 'news' tĩnh) */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-4">
                        Tin tức công nghệ
                    </h2>
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

            {/* 6. Phản hồi của khách Section (Dùng state 'testimonials' tĩnh) */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">
                        Phản hồi của khách hàng
                    </h2>
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

// --- Các components con để code gọn hơn ---

// Component cho Product Section (tái sử dụng)
const ProductSection = ({ title, products }) => (
    <section className="py-16">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{title}</h2>
                <Link
                    to="/products"
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Xem tất cả
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    // Truyền thẳng object product, ProductCard (File 3) sẽ tự xử lý
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    </section>
);

// Component cho 1 thẻ News
const NewsCard = ({ title, excerpt, img }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={img} alt={title} className="w-full h-48 object-cover" />
        <div className="p-5">
            <h3 className="font-semibold text-xl mb-3 h-20 overflow-hidden">
                {title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 h-16 overflow-hidden">
                {excerpt}
            </p>
            <Link
                to="/news/1" // Link tĩnh
                className="text-blue-600 font-semibold border border-blue-600 rounded-full py-2 px-5 hover:bg-blue-600 hover:text-white transition-colors"
            >
                Chi tiết
            </Link>
        </div>
    </div>
);

// Component cho 1 thẻ Testimonial
const TestimonialCard = ({ name, quote }) => (
    <div className="bg-white rounded-lg shadow-md p-6 text-center h-full">
        <p className="text-gray-600 italic mb-4">"{quote}"</p>
        <h4 className="font-semibold text-lg">{name}</h4>
    </div>
);

export default HomePage;
