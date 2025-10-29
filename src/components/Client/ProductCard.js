import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext'; // <-- 1. Import useCart
import { ShoppingCart } from 'lucide-react'; // <-- 1. Import icon
import { toast } from 'react-toastify'; // <-- 1. Import toast

// Định dạng tiền tệ
const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return ""; 
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// Component cho 1 thẻ Product (Dùng props riêng lẻ)
const ProductCard = (props) => {
    // 2. Lấy hàm addToCart từ Context
    const { addToCart } = useCart(); 
    
    // Nhận các props riêng lẻ
    // 3. Thêm prop 'quantity' để kiểm tra tồn kho
    const { id, name, price, oldPrice, discount, img, categoryName, quantity } = props; 

    // Sử dụng placeholder nếu img là null/undefined hoặc chuỗi rỗng
    const imageUrl = img || `https://placehold.co/300x300/e0e7ff/1e3a8a?text=${encodeURIComponent(name || 'Product')}`; 

    // --- Thêm kiểm tra nếu thiếu thông tin cơ bản ---
    if (!id || !name) {
        console.warn("ProductCard received incomplete props:", props);
        return null; 
    }
    // --------------------------------------------------

    // 4. Hàm xử lý khi click nút thêm vào giỏ
    const handleAddToCartClick = (e) => {
        e.preventDefault(); // Ngăn Link chuyển trang khi click vào button
        e.stopPropagation(); // Ngăn sự kiện nổi bọt lên thẻ Link cha
        // Tạo lại product object từ props để truyền vào addToCart
        const productToAdd = { id, name, price, imageUrl: imageUrl, quantity }; // Chỉ cần các thông tin cơ bản
        addToCart(productToAdd, 1); // Thêm 1 sản phẩm
        toast.success(`Đã thêm "${name}" vào giỏ!`);
    };

    return (
        // Bọc Link ở đây để đảm bảo click vào thẻ sẽ chuyển trang
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

            {/* Phần ảnh */}
            <div className="overflow-hidden h-56"> 
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src=`https://placehold.co/300x300/e0e7ff/1e3a8a?text=${encodeURIComponent(name || 'Error')}` 
                    }}
                />
            </div>

            {/* Phần nội dung text */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-2 h-14 overflow-hidden text-gray-800 group-hover:text-blue-600">
                    {name}
                </h3>
                <div className="flex-grow"></div> 
                <div className="flex flex-col items-start gap-1 mt-2">
                    <span className="font-bold text-red-600 text-xl">{formatPrice(price)}</span>
                    {oldPrice && (
                        <span className="text-gray-500 line-through text-sm">{formatPrice(oldPrice)}</span>
                    )}
                </div>
            </div>

            {/* 5. Nút Thêm vào giỏ (Absolute position) */}
            <button 
                onClick={handleAddToCartClick}
                className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-20 disabled:bg-gray-400 disabled:cursor-not-allowed"
                aria-label={`Thêm ${name} vào giỏ hàng`} 
                disabled={quantity === 0} // Disable nếu hết hàng (quantity = 0)
            >
                <ShoppingCart size={20} />
            </button>

            {/* 6. Overlay mờ khi hết hàng */}
             {quantity === 0 && ( 
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 pointer-events-none"> {/* Thêm pointer-events-none để không chặn click Link */}
                    <span className="font-semibold text-red-600 border border-red-600 px-3 py-1 rounded-full">Hết hàng</span>
                </div>
            )}
        </Link> 
    );
};

export default ProductCard;

