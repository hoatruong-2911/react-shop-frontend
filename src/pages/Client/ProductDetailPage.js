import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/Client/productService'; // Import service của Client
import { toast } from 'react-toastify';
import { ChevronRight, ShoppingCart, Minus, Plus, CheckCircle, Shield } from 'lucide-react';
import { useCart } from '../../contexts/CartContext'; // <-- 1. IMPORT USECART

// Hàm định dạng tiền tệ
const formatPrice = (price) => {
    if (typeof price !== 'number') {
        return 'N/A';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductDetailPage = () => {
    const { id } = useParams(); // Lấy id từ URL
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    
    // 2. LẤY HÀM ADD TO CART TỪ CONTEXT
    const { addToCart } = useCart(); 

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await productService.getProductById(id);
                setProduct(res.data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                toast.error("Không tìm thấy sản phẩm!");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]); // Chạy lại khi id thay đổi

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
    
    // Logic thêm vào giỏ hàng
    const handleAddToCart = () => {
        if (!product) return;
        // 3. GỌI HÀM ADDTOCART TỪ CONTEXT
        addToCart(product, quantity); 
        toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                Đang tải chi tiết sản phẩm...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                Không tìm thấy sản phẩm.
            </div>
        );
    }

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-6">
                {/* Breadcrumbs (Thanh điều hướng) */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to="/products" className="hover:text-blue-600">Sản phẩm</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-700">{product.name}</span>
                </div>

                {/* Nội dung chính (2 cột) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Cột 1: Hình ảnh */}
                    <div>
                        <img 
                            src={product.imageUrl || 'https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image'} 
                            alt={product.name}
                            className="w-full h-auto object-cover rounded-lg shadow-md border"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image';
                            }}
                        />
                        {/* (Bạn có thể thêm gallery ảnh nhỏ ở đây) */}
                    </div>

                    {/* Cột 2: Thông tin */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                        
                        <div className="mb-6">
                            <span className="text-4xl font-bold text-red-600">{formatPrice(product.price)}</span>
                            {/* (Thêm giá cũ nếu có) */}
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {product.description || "Sản phẩm chưa có mô tả chi tiết."}
                        </p>

                        <div className="border-t border-b py-6 mb-6 space-y-4">
                            {/* Bộ chọn số lượng */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-28">Số lượng:</span>
                                <div className="flex items-center border rounded-md">
                                    <button 
                                        onClick={() => handleQuantityChange(-1)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input 
                                        type="text" 
                                        value={quantity}
                                        readOnly
                                        className="w-16 text-center border-l border-r py-2"
                                    />
                                    <button 
                                        onClick={() => handleQuantityChange(1)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                        disabled={product.quantity === 0 || quantity >= product.quantity}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <span className="text-gray-500 text-sm ml-4">
                                    ({product.quantity} sản phẩm có sẵn)
                                </span>
                            </div>

                            {/* Thông tin kho, danh mục */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-28">Danh mục:</span>
                                <Link to={`/products?category=${product.categoryId}`} className="text-blue-600 hover:underline">
                                    {product.categoryName || 'Chưa phân loại'}
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 w-28">Tình trạng:</span>
                                {product.quantity > 0 ? (
                                    <span className="text-green-600 font-semibold">Còn hàng</span>
                                ) : (
                                    <span className="text-red-600 font-semibold">Hết hàng</span>
                                )}
                            </div>
                        </div>

                        {/* Nút Thêm vào giỏ */}
                        <button 
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart size={22} />
                            Thêm vào giỏ hàng
                        </button>

                        {/* Cam kết */}
                        <div className="mt-8 space-y-3 text-gray-600">
                            <div className="flex items-center gap-3">
                                <Shield size={20} className="text-blue-500" />
                                <span>Bảo hành chính hãng 12 tháng.</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle size={20} className="text-green-500" />
                                <span>Cam kết hàng mới 100% (Fullbox).</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* (Phần sản phẩm liên quan - bạn có thể thêm sau) */}
                <div className="mt-20 border-t pt-12">
                    <h2 className="text-3xl font-bold text-center mb-10">Sản phẩm liên quan</h2>
                    {/* (Render 1 lưới ProductCard ở đây) */}
                    <div className="text-center text-gray-500">(Chức năng đang được phát triển)</div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;