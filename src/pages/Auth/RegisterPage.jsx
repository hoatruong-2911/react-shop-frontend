import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./register.css";
import logo from "../../assets/images/thuong_hieu_cua_hoa.png";

export default function RegisterPage() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  // FE chỉ kiểm tra những thứ backend không làm:
  // - nhập đầy đủ
  // - xác nhận mật khẩu
  // - tick đồng ý
  const validate = () => {
    if (!form.name.trim()) return "Vui lòng nhập họ tên.";
    if (!form.email.trim()) return "Vui lòng nhập email.";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại.";
    if (!form.address.trim()) return "Vui lòng nhập địa chỉ.";
    if (!form.password) return "Vui lòng nhập mật khẩu.";
    if (!form.confirm) return "Vui lòng nhập mật khẩu xác nhận.";
    if (form.password !== form.confirm) return "Mật khẩu xác nhận không khớp.";
    if (!form.agree) return "Bạn cần đồng ý với chính sách trước khi tiếp tục.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    try {
      setLoading(true);
      await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
      });

      nav("/login", { replace: true });
    } catch (ex) {
      const data = ex?.response?.data;
      const msg =
        data?.error ||
        data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Cột trái (hero) */}
      <div className="auth-hero">
        <img src={logo} alt="TH Digital" className="auth-brand" />
        <p className="auth-hero-line1">Chào mừng bạn đến với TECH-SHOP –</p>
        <p className="auth-hero-line2">Tạo tài khoản để bắt đầu mua sắm!</p>
        <p className="auth-hero-note">
          Nếu đã có tài khoản, vui lòng{" "}
          <Link to="/login">đăng nhập</Link> để trải nghiệm đầy đủ tính năng.
        </p>
      </div>

      {/* Card phải (form) */}
      <div className="auth-card">
        <h1 className="auth-title">REGISTER</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">HỌ TÊN:</label>
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Họ và tên của bạn"
              value={form.name}
              onChange={onChange}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">EMAIL:</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div className="auth-field-grid">
            <div className="auth-field">
              <label className="auth-label">SỐ ĐIỆN THOẠI:</label>
              <input
                className="auth-input"
                type="tel"
                name="phone"
                placeholder="VD: 0909xxxxxx"
                value={form.phone}
                onChange={onChange}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">ĐỊA CHỈ:</label>
              <input
                className="auth-input"
                type="text"
                name="address"
                placeholder="Địa chỉ nhận hàng"
                value={form.address}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="auth-field-grid">
            <div className="auth-field">
              <label className="auth-label">MẬT KHẨU:</label>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={onChange}
              />
            </div>
            <div className="auth-field">
              <label className="auth-label">XÁC NHẬN MẬT KHẨU:</label>
              <input
                className="auth-input"
                type="password"
                name="confirm"
                placeholder="Nhập lại mật khẩu"
                value={form.confirm}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="auth-row">
            <label className="auth-agree">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={onChange}
              />
              <span>Tôi đồng ý với chính sách của bạn</span>
            </label>
          </div>

          {err && <div className="auth-error">{err}</div>}

          <button className="auth-btn" disabled={loading}>
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </button>

          <div className="auth-alt">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
