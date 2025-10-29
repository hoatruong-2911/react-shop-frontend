import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../../services/Admin/productService';
import categoryService from '../../../services/Admin/categoryService';
import { toast } from 'react-toastify';

const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState({ name: '', price: 0, quantity: 0, description: '', categoryId: '', imageUrl: '' });
    const [categories, setCategories] = useState([]);
    const [newImageFile, setNewImageFile] = useState(null);

    useEffect(() => {
        console.log("useEffect running: Lấy dữ liệu sản phẩm và danh mục.");
        // Lấy thông tin sản phẩm cần sửa để điền vào form
        productService.getProductById(id)
            .then(res => {
                console.log("Dữ liệu sản phẩm nhận được từ API:", res.data);
                setProduct(res.data);
            })
            .catch(err => console.error("LỖI khi lấy thông tin sản phẩm!", err));

        // Lấy danh sách category cho dropdown
        categoryService.getAllCategories()
            .then(res => {
                console.log("Dữ liệu danh mục nhận được từ API:", res.data);
                setCategories(res.data);
            })
            .catch(err => console.error("LỖI khi lấy danh sách category!", err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        console.log("Người dùng đã chọn file mới:", e.target.files[0]);
        setNewImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("--- BẮT ĐẦU QUÁ TRÌNH SUBMIT ---");
        let updatedProductData = { ...product };
        console.log("Dữ liệu sản phẩm ban đầu trong state:", product);

        try {
            // Nếu người dùng có chọn một file ảnh mới để thay thế
            if (newImageFile) {
                console.log("PHÁT HIỆN FILE MỚI. Bắt đầu upload...");
                toast.info("Đang upload ảnh mới...");
                
                // Upload ảnh mới trước
                const uploadResponse = await productService.uploadFile(newImageFile);
                console.log("UPLOAD THÀNH CÔNG. Response từ server:", uploadResponse);

                // Cập nhật lại imageUrl trong data sản phẩm bằng URL mới
                updatedProductData.imageUrl = uploadResponse.data;
                console.log("URL ảnh mới đã được cập nhật:", updatedProductData.imageUrl);
            } else {
                console.log("KHÔNG CÓ FILE MỚI. Giữ nguyên ảnh cũ:", product.imageUrl);
            }

            console.log("DỮ LIỆU CUỐI CÙNG chuẩn bị gửi đi để cập nhật:", updatedProductData);
            
            // Gửi dữ liệu sản phẩm đã cập nhật (với imageUrl cũ hoặc mới)
            await productService.updateProduct(id, updatedProductData);
            
            toast.success("Cập nhật sản phẩm thành công!");
            console.log("CẬP NHẬT THÀNH CÔNG. Đang chuyển hướng...");
            navigate('/admin/products');

        } catch (error) {
            console.error("--- ĐÃ XẢY RA LỖI TRONG QUÁ TRÌNH SUBMIT ---", error);
            if (error.response) {
                console.error("Chi tiết lỗi từ server (error.response.data):", error.response.data);
                console.error("Status lỗi (error.response.status):", error.response.status);
            }
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa Sản phẩm (ID: {id})</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Tên sản phẩm:</label>
                    <input type="text" name="name" value={product.name || ''} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
                </div>

                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Giá:</label>
                    <input type="number" name="price" value={product.price || 0} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
                </div>

                 <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Số lượng:</label>
                    <input type="number" name="quantity" value={product.quantity || 0} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md" />
                </div>

                <div className="flex items-start">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right mt-2">Mô tả:</label>
                    <textarea name="description" value={product.description || ''} onChange={handleChange} className="w-3/4 p-2 border border-gray-300 rounded-md" rows="3"></textarea>
                </div>

                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Danh mục:</label>
                    <select name="categoryId" value={product.categoryId || ''} onChange={handleChange} required className="w-3/4 p-2 border border-gray-300 rounded-md">
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Ảnh hiện tại:</label>
                    {product.imageUrl ? 
                        <img src={product.imageUrl} alt="Ảnh sản phẩm" className="h-24 w-24 object-cover rounded-md" /> : 
                        <span className="text-gray-500">Chưa có ảnh</span>
                    }
                </div>

                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Thay đổi ảnh:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-3/4 p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded">
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProductPage;