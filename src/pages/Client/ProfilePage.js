import React, { useEffect, useMemo, useRef, useState } from "react";
import UserService from "../../services/Client/userService";
import productService from "../../services/Admin/productService"; // để upload file
import { toast } from "react-toastify";

// ---- chuẩn hóa URL ảnh (giống các trang khác) ----
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080/api";
const ORIGIN   = API_BASE.replace(/\/api\/?$/, "");
const PLACEHOLDER = "https://placehold.co/160x160/e2e8f0/94a3b8?text=Avatar";

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
  if (v.startsWith("files/"))  return `${API_BASE}/${v}`;
  if (!v.includes("/"))        return `${API_BASE}/files/${v}`;
  return `${API_BASE}/${v.replace(/^\/+/, "")}`;
}

export default function ProfilePage() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  // trạng thái UI
  const [openEdit, setOpenEdit] = useState(false);
  const [openPwd, setOpenPwd]   = useState(false);
  const [menuAvatar, setMenuAvatar] = useState(false);
  const fileRef = useRef(null);

  // form Edit info
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  // form đổi mật khẩu
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await UserService.getMe();
        setMe(data || null);
        setForm({
          name:   data?.name   || "",
          phone:  data?.phone  || "",
          email:  data?.email  || "",
          address:data?.address|| "",
        });
      } catch (e) {
        toast.error("Không lấy được thông tin tài khoản.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const avatarURL = useMemo(
    () => normFileUrl(me?.avatarUrl) || PLACEHOLDER,
    [me?.avatarUrl]
  );

  const handleSaveInfo = async () => {
    try {
      const payload = { ...form, id: me?.id };
      await UserService.updateMe(payload);
      toast.success("Đã cập nhật thông tin!");
      setMe((m) => ({ ...m, ...payload }));
      setOpenEdit(false);
    } catch (e) {
      const msg = e?.response?.data?.error || "Cập nhật thất bại!";
      toast.error(msg);
    }
  };

  const handleChangePwd = async () => {
    if (!pwd.newPassword || pwd.newPassword !== pwd.confirm) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      await UserService.changePassword({
        currentPassword: pwd.currentPassword,
        newPassword: pwd.newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPwd({ currentPassword: "", newPassword: "", confirm: "" });
      setOpenPwd(false);
    } catch (e) {
      const msg = e?.response?.data?.error || "Đổi mật khẩu thất bại!";
      toast.error(msg);
    }
  };

  const onPickAvatar = () => fileRef.current?.click();

  const onFileChosen = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      toast.info("Đang upload avatar…");
      const imagePath = await productService.uploadFile(f); // hàm này trả về { filename, url } hoặc chuỗi
      const newUrl = typeof imagePath === "string" ? imagePath : imagePath?.url || imagePath?.filename;
      await UserService.updateMe({ id: me?.id, avatarUrl: newUrl });
      setMe((m) => ({ ...m, avatarUrl: newUrl }));
      toast.success("Đã cập nhật avatar!");
    } catch (err) {
      toast.error("Upload/cập nhật avatar thất bại!");
    } finally {
      // reset input để chọn lại cùng 1 file cũng được
      e.target.value = "";
      setMenuAvatar(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-lg">Đang tải hồ sơ…</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Hồ sơ của bạn</h1>

      {/* Hàng trên: Avatar + Info + 2 nút */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Avatar Card */}
        <div className="rounded-2xl p-6 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 relative">
          <div className="flex flex-col items-center">
            <div
              className="relative h-40 w-40 rounded-full border-4 border-white shadow-md ring-1 ring-slate-200 overflow-hidden cursor-pointer"
              onClick={() => setMenuAvatar((x) => !x)}
              title="Nhấn để mở menu avatar"
            >
              <img src={avatarURL} alt="avatar" className="h-full w-full object-cover" />
            </div>

            {/* menu avatar */}
            {menuAvatar && (
              <div className="mt-3 w-44 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-slate-50"
                  onClick={() => window.open(avatarURL, "_blank")}
                >
                  Xem avatar
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-slate-50" onClick={onPickAvatar}>
                  Đổi avatar
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={onFileChosen}
              className="hidden"
            />

            <div className="mt-4 text-sm text-slate-500">ID: <span className="font-medium">{me?.id}</span></div>
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-2xl p-6 border border-slate-200 bg-white">
          <div className="text-lg font-semibold mb-4">Thông tin cá nhân</div>

          {/* Hiển thị text gọn, không badge vai trò */}
          <div className="space-y-2 text-slate-700">
            <div><span className="text-slate-500">Họ tên:</span> <span className="font-medium">{me?.name || "—"}</span></div>
            <div className="grid grid-cols-2 gap-6">
              <div><span className="text-slate-500">Điện thoại:</span> <span className="font-medium">{me?.phone || "—"}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium">{me?.email || "—"}</span></div>
            </div>
            <div><span className="text-slate-500">Địa chỉ:</span> <span className="font-medium">{me?.address || "—"}</span></div>
          </div>

          {/* 2 nút hành động */}
          <div className="mt-6 flex gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setOpenEdit(true)}
            >
              Đổi thông tin
            </button>
            <button
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
              onClick={() => setOpenPwd(true)}
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* PANEL dưới: xuất hiện khi nhấn 1 trong 2 nút */}
      {(openEdit || openPwd) && (
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-6">
          {openEdit && (
            <div className="space-y-4">
              <div className="text-lg font-semibold">Sửa thông tin</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Họ tên</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Điện thoại</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-500 mb-1">Địa chỉ</label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSaveInfo}>
                  Lưu
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50" onClick={() => setOpenEdit(false)}>
                  Hủy
                </button>
              </div>
            </div>
          )}

          {openPwd && (
            <div className="space-y-4">
              <div className="text-lg font-semibold">Đổi mật khẩu</div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={pwd.currentPassword}
                    onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={pwd.newPassword}
                    onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">Xác nhận</label>
                  <input
                    type="password"
                    value={pwd.confirm}
                    onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleChangePwd}>
                  Đổi mật khẩu
                </button>
                <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50" onClick={() => setOpenPwd(false)}>
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
