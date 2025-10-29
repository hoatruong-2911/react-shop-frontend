import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../../../services/Admin/categoryService';
import productService from '../../../services/Admin/productService'; // Cần để upload file
import { toast } from 'react-toastify';

const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [category, setCategory] = useState({ name: '', imageUrl: '' });
    // 1. THÊM STATE ĐỂ LƯU FILE ẢNH MỚI
    const [newImageFile, setNewImageFile] = useState(null);

    useEffect(() => {
        // Lấy dữ liệu cũ của category để điền vào form
        categoryService.getCategoryById(id)
            .then(res => setCategory(res.data))
            .catch(err => console.error("Lỗi khi lấy dữ liệu category!", err));
    }, [id]);

    const handleChange = (e) => {
        setCategory({ ...category, name: e.target.value });
    };

    // 2. THÊM HÀM XỬ LÝ CHỌN FILE
    const handleFileChange = (e) => {
        setNewImageFile(e.target.files[0]);
    };

    // 3. CẬP NHẬT LẠI HÀM SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedCategoryData = { ...category };

        try {
            // Nếu người dùng chọn ảnh mới
            if (newImageFile) {
                toast.info("Đang upload ảnh mới...");
                const uploadResponse = await productService.uploadFile(newImageFile);
                updatedCategoryData.imageUrl = uploadResponse.data;
            }

            // Cập nhật danh mục với imageUrl cũ hoặc mới
            await categoryService.updateCategory(id, updatedCategoryData);
            toast.success('Cập nhật danh mục thành công!');
            navigate('/admin/categories');

        } catch (err) {
            console.error("Lỗi khi cập nhật!", err);
            toast.error("Cập nhật thất bại!");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">{`Chỉnh sửa Danh mục (ID: ${id})`}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Tên danh mục:</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleChange}
                        required
                        className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 4. HIỂN THỊ ẢNH HIỆN TẠI */}
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Ảnh hiện tại:</label>
                    {category.imageUrl ? 
                        <img src={category.imageUrl} alt="Ảnh danh mục" className="h-24 w-24 object-cover rounded-md" /> : 
                        <span className="text-gray-500">Chưa có ảnh</span>
                    }
                </div>

                {/* 5. THÊM Ô UPLOAD ĐỂ THAY ĐỔI ẢNH */}
                <div className="flex items-center">
                    <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">Thay đổi ảnh:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-3/4 p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-colors duration-200">
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategoryPage;