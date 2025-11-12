import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../../../services/Admin/categoryService';
import productService from '../../../services/Admin/productService';
import { toast } from 'react-toastify';
import { toImageSrc, PLACEHOLDER_IMG } from '../../../services/utils/img';

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState({ name: '', imageUrl: '' });
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    categoryService
      .getCategoryById(id)
      .then((res) => setCategory(res.data))
      .catch((err) => console.error('Lỗi lấy dữ liệu category:', err));
  }, [id]);

  const handleChange = (e) =>
    setCategory({ ...category, name: e.target.value });

  const handleFileChange = (e) => setNewImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updated = { ...category };

    try {
      if (newImageFile) {
        toast.info('Đang upload ảnh mới...');
        const imageUrl = await productService.uploadFile(newImageFile);
        updated.imageUrl = imageUrl;
      }

      await categoryService.updateCategory(id, updated);
      toast.success('Cập nhật danh mục thành công!');
      navigate('/admin/categories');
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      toast.error('Cập nhật thất bại!');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        Chỉnh sửa Danh mục (ID: {id})
      </h2>
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
            Ảnh hiện tại:
          </label>
          <img
            src={toImageSrc(category) || PLACEHOLDER_IMG}
            alt="Ảnh danh mục"
            className="h-24 w-24 object-cover rounded-md"
            onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
          />
        </div>

        <div className="flex items-center">
          <label className="w-1/4 text-gray-700 font-semibold pr-4 text-right">
            Thay đổi ảnh:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-3/4 p-2 border border-gray-300 rounded-md file:bg-blue-50 file:text-blue-700 file:rounded-full hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryPage;
