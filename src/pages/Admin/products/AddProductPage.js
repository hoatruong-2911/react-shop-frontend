import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../../services/Admin/productService';
import categoryService from '../../../services/Admin/categoryService';
import { toast } from 'react-toastify';

const AddProductPage = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({ name: '', price: '', quantity: '', description: '', categoryId: '' });
    const [categories, setCategories] = useState([]);

    // 1. Thêm state để lưu file ảnh người dùng chọn
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        categoryService.getAllCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error("Lỗi khi lấy danh sách category!", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // 2. Thêm hàm để xử lý khi người dùng chọn file
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 3. Cập nhật lại hoàn toàn hàm submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error("Vui lòng chọn một hình ảnh cho sản phẩm!");
            return;
        }

        try {
            // Bước A: Upload ảnh trước
            toast.info("Đang upload ảnh...");
            const uploadResponse = await productService.uploadFile(selectedFile);
            const imageUrl = uploadResponse.data; // Lấy URL ảnh từ response

            // Bước B: Tạo sản phẩm với imageUrl vừa nhận được
            const newProduct = { ...product, imageUrl: imageUrl };
            await productService.createProduct(newProduct);

            toast.success("Thêm sản phẩm thành công!");
            navigate('/admin/products'); // Chuyển về trang danh sách

        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm!', error);
            toast.error('Thêm sản phẩm thất bại!');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Thêm Sản phẩm mới</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... (Các ô input cho name, price, quantity... giữ nguyên) ... */}

                {/* 4. THÊM Ô INPUT CHO FILE ẢNH */}
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Hình ảnh:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        required
                        className="w-3/4 p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {/* ... (Các div input khác copy từ file cũ của bạn) ... */}
                <div className="flex items-center">
                     <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Tên sản phẩm:</label>
                     <input type="text" name="name" value={product.name} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex items-center">
                     <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Giá:</label>
                     <input type="number" name="price" value={product.price} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
                </div>
                 <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Số lượng:</label>
                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Mô tả:</label>
                    <textarea name="description" value={product.description} onChange={handleChange} className="w-3/4 p-2 border border-gray-300 rounded-md" rows="3"></textarea>
                </div>
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Danh mục:</label>
                    <select name="categoryId" value={product.categoryId} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                        Thêm sản phẩm
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProductPage;