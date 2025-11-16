import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminTopicService from "../../../services/Admin/topicService";
import { toast } from "react-toastify";

const TopicListPage = () => {
  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      const res = await AdminTopicService.getAllTopics();
      setTopics(res.data);
    } catch (e) {
      toast.error("Không thể tải danh sách topic!");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá topic này?")) return;
    try {
      await AdminTopicService.deleteTopic(id);
      toast.success("Đã xoá topic!");
      loadData();
    } catch {
      toast.error("Xoá thất bại!");
    }
  };

  const filtered = topics.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Topic</h2>

        <Link to="/admin/topics/add">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            + Thêm Topic
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên..."
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

      <table className="w-full border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Tên chủ đề</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t) => (
            <tr key={t.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{t.id}</td>
              <td className="p-3">{t.name}</td>
              <td className="p-3">{t.slug}</td>
              <td className="p-3">
                <Link to={`/admin/topics/edit/${t.id}`}>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2">
                    Sửa
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                Không có topic nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TopicListPage;
