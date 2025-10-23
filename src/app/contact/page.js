"use client"; // 👈 cần thêm để xử lý sự kiện phía client trong Next.js App Router


import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  // ✅ Hàm xử lý thay đổi dữ liệu khi nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Hàm xử lý khi gửi form
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trang reload
    console.log("Dữ liệu người dùng:", formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow mt-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Liên hệ với chúng tôi</h1>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Nội dung</label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 focus:outline-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Gửi
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600 font-semibold mb-3">🎉 Gửi thành công!</p>
          <p><b>Họ tên:</b> {formData.name}</p>
          <p><b>Email:</b> {formData.email}</p>
          <p><b>Nội dung:</b> {formData.message}</p>

          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Gửi lại
          </button>
        </div>
      )}
    </div>
  );
}
