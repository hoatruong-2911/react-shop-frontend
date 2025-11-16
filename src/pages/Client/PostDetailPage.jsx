// src/pages/Client/NewsDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ClientPostService from "../../services/Client/postService";
import ClientPostServiceDefault from "../../services/Client/postService"; // ensure import
import ClientPost from "../../services/Client/postService";
import { toast } from "react-toastify";

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

// sanitize HTML: remove <script> tags before dangerouslySetInnerHTML
function sanitizeHtml(html) {
  if (!html) return "";
  // remove <script>...</script>
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

const PostDetailPage = () => {
  const { slug } = useParams(); // note: route may be /news/:slug or /news/:id
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetch = async () => {
      setLoading(true);
      let p = null;

      // 1) Try to fetch by slug (best option if backend supports)
      try {
        const res = await ClientPostService.getPostBySlug(slug);
        if (res && res.data) {
          p = res.data;
        }
      } catch (err) {
        // ignore, we'll fallback
      }

      // 2) If not found by slug, try treat slug as numeric id
      if (!p) {
        if (/^\d+$/.test(slug)) {
          try {
            const r2 = await ClientPostService.getPostById(slug);
            if (r2 && r2.data) p = r2.data;
          } catch (err) {
            // ignore
          }
        }
      }

      // 3) Final fallback: load all posts and find by slug
      if (!p) {
        try {
          const all = await ClientPostService.getAllPosts();
          const list = all.data || [];
          p = list.find((x) => String(x.slug) === String(slug));
        } catch (err) {
          // ignore
        }
      }

      if (!p) {
        toast.error("Không tìm thấy bài viết.");
        setPost(null);
        setRelated([]);
        setLoading(false);
        return;
      }

      // Normalize image url and createdAt
      p.imageUrl = normFileUrl(p.imageUrl);
      setPost(p);

      // load related posts (same topic) — simple approach: fetch all and filter
      try {
        const resAll = await ClientPostService.getAllPosts();
        const listAll = resAll.data || [];
        const relatedPosts = listAll
          .filter((it) => it.id !== p.id && it.topicId === p.topicId)
          .slice(0, 4)
          .map((it) => ({ ...it, imageUrl: normFileUrl(it.imageUrl) }));
        setRelated(relatedPosts);
      } catch (err) {
        setRelated([]);
      }

      setLoading(false);
    };

    fetch();
  }, [slug]);

  if (loading)
    return (
      <div className="container mx-auto px-6 py-12 text-center">Đang tải...</div>
    );

  if (!post)
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        Bài viết không tồn tại.
      </div>
    );

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Trang chủ
          </Link>{" "}
          / <span className="text-gray-600">{post.title}</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          {post.topicName ? <span>Chủ đề: {post.topicName} • </span> : null}
          {post.createdAt ? (
            <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
          ) : null}
        </div>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full max-h-[500px] object-cover rounded mb-6"
          />
        )}

        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || "") }}
        ></div>

        {/* Related */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Bài viết liên quan</h3>
          {related.length === 0 ? (
            <div className="text-gray-500">Không có bài liên quan.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/post/${r.slug || r.id}`}
                  className="block bg-gray-50 p-2 rounded hover:shadow"
                >
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-36 object-cover rounded"
                  />
                  <div className="mt-2 font-medium text-sm">{r.title}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
