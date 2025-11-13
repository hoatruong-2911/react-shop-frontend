// src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./login.css";
import logo from "../../assets/images/thuong_hieu_cua_hoa.png";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");
  if (!email || !password) {
    setErr("Vui lòng nhập đầy đủ Email và Mật khẩu.");
    return;
  }

  try {
    setLoading(true);

    // 1) Login -> backend set cookie HttpOnly và trả { token, next, role }
    const res = await authService.login(email, password); // { token, next, role }
    const next = (res && res.next) || "/";

    // ⭐ Lưu token & role để interceptor + giao diện dùng
    if (res?.token) {
      localStorage.setItem("token", res.token);
    }
    if (res?.role) {
      localStorage.setItem("role", res.role);
    }

    // 2) Điều hướng NGAY, không chờ /auth/me
    window.dispatchEvent(new Event("auth-changed"));
    nav(next, { replace: true });

    // 3) Gọi /auth/me ở nền để lưu thông tin user
    authService
      .me()
      .then((me) => {
        localStorage.setItem("auth_user", JSON.stringify(me));
        window.dispatchEvent(new Event("auth-changed"));
      })
      .catch(() => {
        // bỏ qua lỗi lần đầu
      });
  } catch (ex) {
    setErr(
      ex?.response?.data?.error || "Đăng nhập thất bại. Vui lòng thử lại."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="lp-wrap">
      <div className="lp-left">
        <img src={logo} alt="TH Digital" className="brand" />
        <p className="hero-txt1">Khám phá thế giới công nghệ thông minh –</p>
        <p className="hero-txt2">Đăng nhập để bắt đầu!</p>
        <p className="hero-txt3">
          Nếu bạn chưa có tài khoản, hãy{" "}
          <Link to="/register" className="link-green">
            tạo ngay
          </Link>{" "}
          hôm nay để không bỏ lỡ các ưu đãi hấp dẫn.
        </p>
      </div>

      <div className="lp-right">
        <h1 className="lp-title">LOGIN</h1>

        <form className="lp-form" onSubmit={handleSubmit}>
          <label className="lb">EMAIL:</label>
          <input
            className="ipt"
            type="email"
            placeholder="Hãy nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="lb">PASSWORD:</label>
          <input
            className="ipt"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="agree">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>Tôi đồng ý với chính sách của bạn</span>
          </label>

          <Link to="/forgot" className="forgot">
            Tôi không nhớ mật khẩu
          </Link>

          {err && <div className="err">{err}</div>}

          <button className="btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
