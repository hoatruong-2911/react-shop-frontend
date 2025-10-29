import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../../services/Admin/categoryService';
import productService from '../../../services/Admin/productService'; // Cần import để dùng hàm uploadFile
import { toast } from 'react-toastify';

const AddCategoryPage = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState({ name: '' });
    // 1. THÊM STATE ĐỂ LƯU FILE ẢNH
    const [selectedFile, setSelectedFile] = useState(null);

    const handleChange = (e) => {
        setCategory({ ...category, name: e.target.value });
    };

    // 2. THÊM HÀM ĐỂ XỬ LÝ CHỌN FILE
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // 3. CẬP NHẬT LẠI HÀM SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error("Vui lòng chọn một hình ảnh cho danh mục!");
            return;
        }

        try {
            // Bước A: Upload ảnh trước
            toast.info("Đang upload ảnh...");
            const uploadResponse = await productService.uploadFile(selectedFile);
            const imageUrl = uploadResponse.data;

            // Bước B: Tạo danh mục với imageUrl vừa nhận được
            const newCategory = { ...category, imageUrl: imageUrl };
            await categoryService.createCategory(newCategory);

            toast.success('Thêm danh mục thành công!');
            navigate('/admin/categories'); // Quay về trang danh sách

        } catch (err) {
            console.error("Lỗi khi thêm danh mục!", err);
            toast.error("Thêm danh mục thất bại!");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Thêm Danh mục mới</h2>
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

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded transition-colors duration-200">
                        Thêm danh mục
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategoryPage;