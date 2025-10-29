import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ChevronRight, ShoppingCart } from 'lucide-react';

// Hàm định dạng tiền tệ
const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return 'N/A'; // Handle invalid price
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

// --- COMPONENT CON: Hàng sản phẩm trong giỏ ---
// Đã cập nhật để nhận thêm props isSelected và toggleSelectItem
const CartItemRow = ({ item, updateQuantity, removeFromCart, isSelected, toggleSelectItem }) => {
    
    const handleQuantityChange = (amount) => {
        const newQuantity = item.quantity + amount;
        // Logic cập nhật số lượng (đảm bảo >= 1)
        updateQuantity(item.id, Math.max(1, newQuantity)); 
    };

    const handleRemove = () => {
        if (window.confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)) {
            removeFromCart(item.id);
        }
    };

    return (
        <div className={`flex items-center py-5 border-b ${isSelected ? 'bg-blue-50/30' : ''}`}>
            {/* Checkbox */}
            <div className="w-1/12 flex justify-center px-2">
                <input 
                    type="checkbox" 
                    checked={isSelected} 
                    onChange={() => toggleSelectItem(item.id)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
            </div>

            {/* Sản phẩm (width điều chỉnh) */}
            <div className="w-5/12 flex items-center pr-4"> 
                <img 
                    src={item.imageUrl || 'https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Image'} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4 border"
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/e2e8f0/94a3b8?text=No+Image' }}
                />
                <div>
                    <Link to={`/product/${item.id}`} className="font-semibold text-lg text-gray-800 hover:text-blue-600 line-clamp-2">
                        {item.name}
                    </Link>
                    <button onClick={handleRemove} className="text-red-500 text-sm hover:underline mt-1 flex items-center gap-1">
                        <Trash2 size={14} /> Xóa
                    </button>
                </div>
            </div>

            {/* Giá (width điều chỉnh) */}
            <div className="w-2/12 text-center">
                <span className="text-gray-700">{formatPrice(item.price)}</span>
            </div>

            {/* Số lượng (width điều chỉnh) */}
            <div className="w-2/12 flex justify-center">
                <div className="flex items-center border rounded-md">
                    <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md disabled:opacity-50"
                        disabled={item.quantity <= 1} // Disable nếu số lượng là 1
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
                        // (Thêm disabled nếu vượt tồn kho nếu cần)
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Tổng cộng (width điều chỉnh) */}
            <div className="w-2/12 text-center font-semibold text-gray-800">
                {formatPrice(item.price * item.quantity)}
            </div>
        </div>
    );
};


// --- COMPONENT CHÍNH: Trang Giỏ Hàng ---
const CartPage = () => {
    // Lấy thêm các state và hàm mới từ Context
    const { 
        cartItems, 
        selectedItems, // <-- Danh sách ID đang chọn
        updateQuantity, 
        removeFromCart, 
        selectedCartTotal, // <-- Tổng tiền ĐÃ CHỌN
        toggleSelectItem, // <-- Hàm bật/tắt chọn 1 item
        toggleSelectAll, // <-- Hàm bật/tắt chọn tất cả
        isAllSelected // <-- Biến kiểm tra có phải đang chọn tất cả
    } = useCart();

    const shippingFee = selectedItems.length > 0 ? 30000 : 0; // Chỉ tính phí ship nếu có hàng được chọn
    const finalTotal = selectedCartTotal + shippingFee;

    return (
        <div className="bg-gray-50/50 py-12">
            <div className="container mx-auto px-6">
                
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-700">Giỏ hàng</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    // Giỏ hàng trống (giữ nguyên)
                    <div className="text-center bg-white p-12 rounded-lg shadow-md border">
                        <ShoppingCart size={60} className="mx-auto text-gray-400 mb-6" />
                        <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
                        <p className="text-gray-600 mb-8">
                            Bạn chưa thêm sản phẩm nào vào giỏ.
                        </p>
                        <Link 
                            to="/products"
                            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    // Giỏ hàng có sản phẩm
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Cột 1: Danh sách sản phẩm */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border">
                            {/* Header bảng (thêm checkbox chọn tất cả) */}
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

                            {/* Các hàng sản phẩm */}
                            <div>
                                {cartItems.map(item => (
                                    <CartItemRow 
                                        key={item.id} 
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeFromCart={removeFromCart}
                                        // Truyền trạng thái và hàm toggle
                                        isSelected={selectedItems.includes(item.id)} 
                                        toggleSelectItem={toggleSelectItem}
                                    />
                                ))}
                            </div>

                            <div className="mt-6 flex justify-between items-center">
                                <Link to="/products" className="text-blue-600 font-semibold hover:underline">
                                    ← Tiếp tục mua sắm
                                </Link>
                                {/* (Bạn có thể thêm nút "Xóa các mục đã chọn" ở đây) */}
                            </div>
                        </div>
                        
                        {/* Cột 2: Tóm tắt đơn hàng (cập nhật lại total) */}
                        <div className="lg:col-span-1 h-fit bg-white p-8 rounded-lg shadow-md border sticky top-24">
                            <h2 className="text-2xl font-semibold mb-6 border-b pb-4">Tóm tắt đơn hàng</h2>
                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính ({selectedItems.length} sản phẩm):</span>
                                    {/* Sử dụng selectedCartTotal */}
                                    <span className="font-medium text-gray-800">{formatPrice(selectedCartTotal)}</span> 
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Vận chuyển:</span>
                                    <span className="font-medium text-gray-800">{formatPrice(shippingFee)}</span>
                                </div>
                                <div className="border-t pt-4 mt-4 flex justify-between">
                                    <span className="font-bold text-xl">Thành tiền:</span>
                                    <span className="font-bold text-xl text-red-600">{formatPrice(finalTotal)}</span>
                                </div>
                            </div>
                            
                            {/* Nút thanh toán (chỉ bật khi có sản phẩm được chọn) */}
                            <button 
                                className="mt-8 w-full bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={selectedItems.length === 0} // Disable nếu không có gì được chọn
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