import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bannerService from "../../../services/Admin/bannerService";
import Pagination from "../../../components/Pagination";
import { toast } from "react-toastify";
import { toImageSrc, PLACEHOLDER_IMG } from "../../../services/utils/img";

const BannerListPage = () => {
  const [banners, setBanners] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 4;
  const [loading, setLoading] = useState(true);

  const role = (localStorage.getItem("role") || "").toUpperCase();
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await bannerService.getAllBanners();

      const list = (res.data || []).map((b) => {
        const img = b.imageUrl || b.image_url || "";
        return {
          ...b,
          imageUrl: toImageSrc({ image_url: img }),
        };
      });

      setBanners(list);
      setFiltered(list);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách banner!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = banners;
    if (search.trim()) {
      result = banners.filter((b) =>
        (b.name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
    setCurrentPage(1);
  }, [search, banners]);

  const handleDelete = (id) => {
    if (!isAdmin) return;

    if (window.confirm(`Bạn có muốn xóa banner ID ${id}?`)) {
      bannerService
        .deleteBanner(id)
        .then(() => {
          toast.success("Xóa thành công!");
          loadData();
        })
        .catch(() => toast.error("Không thể xóa banner!"));
    }
  };

  const pageItems = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  if (loading)
    return (
      <div className="text-center text-lg font-semibold">Đang tải dữ liệu...</div>
    );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Danh sách Banner</h2>

        {isAdmin && (
          <Link to="/admin/add-banner">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              + Thêm mới
            </button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4 mb-6 p-4 border rounded bg-gray-50">
        <input
          type="text"
          placeholder="Tìm theo tên banner..."
          className="flex-grow p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          onClick={() => setSearch("")}
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Link điều hướng</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {pageItems.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm">{b.id}</td>

                <td className="py-4 px-6">
                  <img
                    src={b.imageUrl || PLACEHOLDER_IMG}
                    className="h-20 w-36 object-cover rounded border"
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                    alt={b.name}
                  />
                </td>

                <td className="py-4 px-6 text-sm font-medium">{b.name}</td>

                <td className="py-4 px-6 text-sm">
                  {b.linkUrl || <span className="text-gray-400 italic">Không có</span>}
                </td>

                <td className="py-4 px-6 text-sm">{b.position}</td>

                <td className="py-4 px-6 text-sm">
                  {b.status === 1 ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      Ẩn
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-sm">
                  {isAdmin ? (
                    <>
                      <Link to={`/admin/edit-banner/${b.id}`}>
                        <button className="bg-blue-500 text-white py-1 px-3 rounded text-xs mr-2">
                          Sửa
                        </button>
                      </Link>

                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded text-xs"
                        onClick={() => handleDelete(b.id)}
                      >
                        Xóa
                      </button>
                    </>
                  ) : (
                    <span className="opacity-60">Chỉ xem</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        itemsPerPage={perPage}
        totalItems={filtered.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </div>
  );
};

export default BannerListPage;
