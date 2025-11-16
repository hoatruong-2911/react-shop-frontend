import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ClientPostService from "../../services/Client/postService";
import { ChevronDown } from "lucide-react";

// ====== Chuẩn hoá URL ảnh ======
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN = API_BASE.replace(/\/api\/?$/, "");

function normFileUrl(val) {
  if (!val) return "";
  let v = String(val).trim().replace(/\\/g, "/");

  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      if (u.origin === ORIGIN && u.pathname.startsWith("/files/")) {
        return `${ORIGIN}/api${u.pathname}`;
      }
      return v;
    } catch {}
  }

  if (v.startsWith("/api/files/")) return `${ORIGIN}${v}`;
  if (v.startsWith("/files/")) return `${API_BASE}${v}`;
  if (v.startsWith("files/")) return `${API_BASE}/${v}`;
  if (!v.includes("/")) return `${API_BASE}/files/${v}`;
  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}
// ========================================

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const topicQuery = searchParams.get("topic");

  const [selectedTopic, setSelectedTopic] = useState(topicQuery || "");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const res = await ClientPostService.getAllPosts(selectedTopic);

        const mapped = res.data.map((p) => ({
          ...p,
          thumbnail: normFileUrl(p.imageUrl),
        }));

        setPosts(mapped);
      } catch (err) {
        console.error("Load posts failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [selectedTopic]);

  return (
    <div className="bg-gray-50 min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-6">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Tin tức công nghệ
        </h1>

        {/* FILTER BOX */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border">
          <span className="font-semibold">Lọc bài viết</span>

          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="appearance-none rounded border border-gray-300 py-2 px-4 pr-10 bg-white"
            >
              <option value="">Tất cả chủ đề</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>
        </div>

        {/* GRID LIST */}
        {loading ? (
          <div className="text-center py-20 text-xl text-gray-500">Đang tải...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-xl text-gray-500">
            Không có bài viết nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-3 border"
              >
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="h-48 w-full object-cover rounded-md"
                />

                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {post.description || "Không có mô tả"}
                  </p>

                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostPage;
