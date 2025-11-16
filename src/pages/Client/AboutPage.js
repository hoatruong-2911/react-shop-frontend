import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="bg-gray-50">

      {/* ===== Banner ===== */}
      <div className="w-full h-[350px] overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1920"
          alt="Tech Banner"
          className="w-full h-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            
          </h1>
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="container mx-auto px-6 py-16">

        {/* Giới thiệu */}
        <section className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            TECH-SHOP – Nơi công nghệ hội tụ
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Chúng tôi mang đến trải nghiệm mua sắm công nghệ hiện đại, uy tín và
            tận tâm. Từ điện thoại, laptop, phụ kiện cho đến các thiết bị thông
            minh, TECH-SHOP luôn cam kết mang đến sản phẩm chất lượng cùng dịch
            vụ chuyên nghiệp.
          </p>
        </section>

        {/* Ảnh + đoạn text */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920"
            className="rounded-xl shadow-lg"
            alt="About"
          />
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Chúng tôi là ai?
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              TECH-SHOP được thành lập với mục tiêu mang đến trải nghiệm mua
              sắm dễ dàng, an toàn và nhanh chóng. Chúng tôi không ngừng đổi
              mới, cập nhật xu hướng mới nhất để mang lại giá trị thiết thực
              cho khách hàng.
            </p>
          </div>
        </section>

        {/* Box - Sứ mệnh | Tầm nhìn | Giá trị */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Sứ mệnh & Giá trị của chúng tôi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-8 shadow-lg rounded-xl text-center">
              <h4 className="text-xl font-bold mb-3 text-blue-600">Sứ mệnh</h4>
              <p className="text-gray-600">
                Mang công nghệ hiện đại đến mọi người với giá cả hợp lý và dịch
                vụ đáng tin cậy.
              </p>
            </div>

            <div className="bg-white p-8 shadow-lg rounded-xl text-center">
              <h4 className="text-xl font-bold mb-3 text-blue-600">Tầm nhìn</h4>
              <p className="text-gray-600">
                Trở thành địa chỉ mua sắm công nghệ hàng đầu được yêu thích tại
                Việt Nam.
              </p>
            </div>

            <div className="bg-white p-8 shadow-lg rounded-xl text-center">
              <h4 className="text-xl font-bold mb-3 text-blue-600">Giá trị cốt lõi</h4>
              <p className="text-gray-600">
                Uy tín – Chất lượng – Minh bạch – Tận tâm.
              </p>
            </div>

          </div>
        </section>

        {/* Liên hệ */}
        <section className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-6 text-gray-800">Liên hệ với chúng tôi</h3>
          <p className="text-gray-600 text-lg mb-4">
            Hotline: <span className="font-semibold text-blue-600">1900.4444</span>
          </p>
          <p className="text-gray-600 text-lg">
            Địa chỉ: <span className="font-semibold">Văn Lâm 3, Thuận Nam, Ninh Thuận</span>
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold shadow"
          >
            Khám phá sản phẩm
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
