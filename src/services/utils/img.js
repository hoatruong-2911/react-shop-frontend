// src/services/utils/img.js
// Chuẩn hoá mọi kiểu giá trị ảnh (full URL, /files/..., chỉ filename, v.v.)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN   = API_BASE.replace(/\/api\/?$/, "");
export const PLACEHOLDER_IMG = "https://placehold.co/64x64/e2e8f0/94a3b8?text=No+Image";

export function toImageSrc(objOrUrl) {
  // Cho phép truyền cả object (product/category) hoặc chuỗi URL
  if (!objOrUrl) return "";

  let val = objOrUrl;
  if (typeof objOrUrl === "object") {
    val = objOrUrl.imageUrl || objOrUrl.image_url || objOrUrl.image || "";
  }
  if (!val) return "";

  let v = String(val).trim().replace(/\\/g, "/");

  // 1) ĐÃ là full URL
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      // http://host:port/files/... (thiếu /api) -> thêm /api
      if (u.origin === ORIGIN && u.pathname.startsWith("/files/")) {
        return `${ORIGIN}/api${u.pathname}`;
      }
      return v;
    } catch {
      // rơi xuống các nhánh dưới
    }
  }

  // 2) Đường dẫn tương đối
  if (v.startsWith("/api/files/")) return `${ORIGIN}${v}`;
  if (v.startsWith("/files/"))     return `${API_BASE}${v}`;
  if (v.startsWith("files/"))      return `${API_BASE}/${v}`;

  // 3) Chỉ là filename
  if (!v.includes("/")) return `${API_BASE}/files/${v}`;

  // 4) Fallback
  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}
