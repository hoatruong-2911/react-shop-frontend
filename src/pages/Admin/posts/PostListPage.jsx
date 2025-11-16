import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminPostService from "../../../services/Admin/postService";
import { toast } from "react-toastify";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const res = await AdminPostService.getAllPosts();
      setPosts(res.data);
    } catch (e) {
      toast.error("Không thể tải danh sách bài viết!");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá bài viết này?")) return;
    try {
      await AdminPostService.deletePost(id);
      toast.success("Đã xoá bài viết!");
      loadData();
    } catch {
      toast.error("Xoá thất bại!");
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Bài viết</h2>

        <Link to="/admin/posts/add">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            + Thêm Bài viết
          </button>
        </Link>
      </div>

      {/* SEARCH */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="ml-3 bg-gray-600 hover:bg-gray-700 text-white px-4 rounded"
          onClick={() => setSearch("")}
        >
          Reset
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Tiêu đề</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Chủ đề</th>
            <th className="p-3 text-left">Ảnh</th>
            <th className="p-3 text-left">Ngày tạo</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{p.id}</td>
              <td className="p-3">{p.title}</td>
              <td className="p-3 text-gray-600">{p.slug}</td>
              <td className="p-3">
                {p.topicName || <span className="text-gray-400">(không có)</span>}
              </td>

              {/* ẢNH */}
              <td className="p-3">
                {p.imageUrl ? (
                  <img
                    src={process.env.REACT_APP_API_BASE + p.imageUrl}
                    alt={p.title}
                    className="w-20 h-14 object-cover rounded border"
                  />
                ) : (
                  <span className="text-gray-400">Không có ảnh</span>
                )}
              </td>

              <td className="p-3">{p.createdAt?.slice(0, 10)}</td>

              <td className="p-3">
                <Link to={`/admin/posts/edit/${p.id}`}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">
                    Sửa
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-500">
                Không có bài viết nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PostListPage;
