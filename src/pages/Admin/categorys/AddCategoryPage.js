import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../../../services/Admin/categoryService';
import productService from '../../../services/Admin/productService';
import { toast } from 'react-toastify';

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({ name: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => setCategory({ ...category, name: e.target.value });
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Vui lòng chọn một hình ảnh cho danh mục!');
      return;
    }

    try {
      toast.info('Đang upload ảnh...');
      const imageUrl = await productService.uploadFile(selectedFile); // trả về chuỗi URL
      const newCategory = { ...category, imageUrl };
      await categoryService.createCategory(newCategory);
      toast.success('Thêm danh mục thành công!');
      navigate('/admin/categories');
    } catch (err) {
      console.error('Lỗi khi thêm danh mục:', err);
      toast.error('Thêm danh mục thất bại!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Thêm Danh mục mới</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Tên danh mục:
          </label>
          <input
            type="text"
            value={category.name}
            onChange={handleChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Hình ảnh:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-3/4 p-2 border border-gray-300 rounded-md file:bg-blue-50 file:text-blue-700 file:rounded-full hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          >
            Thêm danh mục
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryPage;
