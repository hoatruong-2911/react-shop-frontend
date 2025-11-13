// src/pages/Auth/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./login.css";                      // dùng chung style với Login
import logo from "../../assets/images/thuong_hieu_cua_hoa.png";

export default function ForgotPasswordPage() {
  const nav = useNavigate();

  const [step, setStep] = useState(1);     // 1 = nhập email/phone, 2 = nhập mật khẩu mới
  const [identifier, setIdentifier] = useState(""); // email hoặc phone

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // B1: kiểm tra email / phone
  const handleCheck = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!identifier.trim()) {
        setErr("Vui lòng nhập email hoặc số điện thoại.");
        return;
    }

    try {
        setLoading(true);
        const res = await authService.forgotCheck(identifier.trim());
        setMsg(res?.message || "Thông tin hợp lệ.");
        setStep(2); // chuyển sang bước nhập mật khẩu mới
    } catch (ex) {
        const data = ex?.response?.data;
        setErr(data?.error || "Tài khoản không tồn tại");
    } finally {
        setLoading(false);
    }
    };

    const handleReset = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!newPassword) return setErr("Vui lòng nhập mật khẩu mới.");
    if (newPassword.length < 6) return setErr("Mật khẩu tối thiểu 6 ký tự.");
    if (newPassword !== confirm) return setErr("Mật khẩu xác nhận không khớp.");

    try {
        setLoading(true);
        const res = await authService.forgotReset(
        identifier.trim(),
        newPassword,
        confirm
        );
        setMsg(res?.message || "Đổi mật khẩu thành công.");
        nav("/login", { replace: true });
    } catch (ex) {
        const data = ex?.response?.data;
        setErr(data?.error || "Đổi mật khẩu thất bại.");
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="lp-wrap">
      {/* Cột trái giống Login */}
      <div className="lp-left">
        <img src={logo} alt="TH Digital" className="brand" />
        <p className="hero-txt1">Quên mật khẩu?</p>
        <p className="hero-txt2">Đừng lo, chúng tôi giúp bạn lấy lại.</p>
        <p className="hero-txt3">
          Nhập email hoặc số điện thoại đã dùng để đăng ký, sau đó đặt mật khẩu mới.
          Nếu bạn nhớ mật khẩu, hãy{" "}
          <Link to="/login" className="link-green">
            đăng nhập
          </Link>{" "}
          lại ngay.
        </p>
      </div>

      {/* Cột phải: form */}
      <div className="lp-right">
        <h1 className="lp-title">RESET</h1>

        {step === 1 && (
          <form className="lp-form" onSubmit={handleCheck}>
            <label className="lb">EMAIL HOẶC SỐ ĐIỆN THOẠI:</label>
            <input
              className="ipt"
              type="text"
              placeholder="Nhập email hoặc số điện thoại đã đăng ký"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            {err && <div className="err">{err}</div>}
            {msg && !err && (
              <div className="err" style={{ borderColor: "#A7E0B7", background: "#E8F8EE", color: "#1E7E34" }}>
                {msg}
              </div>
            )}

            <button className="btn" disabled={loading}>
              {loading ? "Đang kiểm tra..." : "Tiếp tục"}
            </button>

            <div style={{ marginTop: 10, textAlign: "center" }}>
              <Link to="/login">Quay lại đăng nhập</Link>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="lp-form" onSubmit={handleReset}>
            <label className="lb">TÀI KHOẢN:</label>
            <input
              className="ipt"
              type="text"
              value={identifier}
              disabled
            />

            <label className="lb">MẬT KHẨU MỚI:</label>
            <input
              className="ipt"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label className="lb">XÁC NHẬN MẬT KHẨU:</label>
            <input
              className="ipt"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {err && <div className="err">{err}</div>}
            {msg && !err && (
              <div className="err" style={{ borderColor: "#A7E0B7", background: "#E8F8EE", color: "#1E7E34" }}>
                {msg}
              </div>
            )}

            <button className="btn" disabled={loading}>
              {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </button>

            <div style={{ marginTop: 10, textAlign: "center" }}>
              <button
                type="button"
                onClick={() => { setStep(1); setNewPassword(""); setConfirm(""); }}
                style={{ border: "none", background: "transparent", color: "#2E86DE", cursor: "pointer" }}
              >
                Đổi tài khoản khác
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
