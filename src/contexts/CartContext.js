import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';

// 1. Tạo Context
const CartContext = createContext();

// 2. Tạo Hook
export const useCart = () => {
    return useContext(CartContext);
};

// 3. Tạo Provider
export const CartProvider = ({ children }) => {
    
    // --- State cho các sản phẩm trong giỏ ---
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Lỗi parse giỏ hàng từ localStorage:", error);
            return [];
        }
    });

    // --- State MỚI: Lưu ID của các sản phẩm được chọn ---
    const [selectedItems, setSelectedItems] = useState(() => {
        // Mặc định chọn tất cả khi load
        try {
            const storedCart = localStorage.getItem('cart');
            const initialCart = storedCart ? JSON.parse(storedCart) : [];
            return initialCart.map(item => item.id); // Lấy ID của tất cả item ban đầu
        } catch {
            return [];
        }
    });

    // Lưu cartItems vào localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        // Khi cartItems thay đổi (vd: xóa item), cập nhật lại selectedItems
        setSelectedItems(prevSelected => prevSelected.filter(id => cartItems.some(item => item.id === id)));
    }, [cartItems]);

    // --- Hàm Thêm vào giỏ ---
    const addToCart = useCallback((product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            let updatedItems;
            if (existingItem) {
                updatedItems = prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Tự động thêm selected: true khi thêm mới
                updatedItems = [...prevItems, { ...product, quantity, selected: true }];
            }
            return updatedItems;
        });
        // Tự động chọn sản phẩm vừa thêm
        if (!selectedItems.includes(product.id)) {
            setSelectedItems(prev => [...prev, product.id]);
        }
    }, [selectedItems]); // Thêm selectedItems vào dependency

    // --- Hàm Cập nhật số lượng ---
    const updateQuantity = useCallback((productId, newQuantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item // Đảm bảo >= 1
            ).filter(item => item.quantity > 0) // Lọc bỏ item nếu quantity <= 0 (để phòng lỗi)
        );
    }, []);

    // --- Hàm Xóa khỏi giỏ ---
    const removeFromCart = useCallback((productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        setSelectedItems(prevSelected => prevSelected.filter(id => id !== productId)); // Xóa khỏi danh sách chọn
        toast.info("Đã xóa sản phẩm khỏi giỏ hàng.");
    }, []);

    // --- Hàm Xóa toàn bộ giỏ ---
    const clearCart = useCallback(() => {
        setCartItems([]);
        setSelectedItems([]); // Xóa hết danh sách chọn
        toast.info("Đã dọn dẹp giỏ hàng.");
    }, []);

    // --- Hàm MỚI: Bật/tắt chọn một sản phẩm ---
    const toggleSelectItem = useCallback((itemId) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(itemId)
                ? prevSelected.filter(id => id !== itemId) // Bỏ chọn
                : [...prevSelected, itemId] // Chọn
        );
    }, []);

    // --- Hàm MỚI: Chọn/Bỏ chọn tất cả ---
    const toggleSelectAll = useCallback(() => {
        if (selectedItems.length === cartItems.length) {
            // Nếu đang chọn tất cả -> Bỏ chọn tất cả
            setSelectedItems([]);
        } else {
            // Nếu chưa chọn tất cả -> Chọn tất cả
            setSelectedItems(cartItems.map(item => item.id));
        }
    }, [cartItems, selectedItems]);


    // --- Tính toán Tổng tiền CHỈ của các sản phẩm ĐƯỢC CHỌN ---
    const selectedCartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => {
            if (selectedItems.includes(item.id)) { // Chỉ cộng nếu được chọn
                return total + (item.price * item.quantity);
            }
            return total;
        }, 0);
    }, [cartItems, selectedItems]); // Thêm selectedItems vào dependency

    // --- Tổng số lượng (vẫn tính tất cả) ---
    const cartCount = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    // --- Kiểm tra xem có phải tất cả đang được chọn không ---
    const isAllSelected = useMemo(() => {
       return cartItems.length > 0 && selectedItems.length === cartItems.length;
    }, [cartItems, selectedItems]);


    // Cung cấp giá trị
    const value = useMemo(() => ({
        cartItems,
        selectedItems, // <-- Mới
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleSelectItem, // <-- Mới
        toggleSelectAll,  // <-- Mới
        selectedCartTotal,// <-- Đổi tên từ cartTotal
        cartCount,
        isAllSelected    // <-- Mới
    }), [
        cartItems, 
        selectedItems, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        toggleSelectItem, 
        toggleSelectAll, 
        selectedCartTotal, 
        cartCount, 
        isAllSelected
    ]); // Tối ưu hóa value

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
