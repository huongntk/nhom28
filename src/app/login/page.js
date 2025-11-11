"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "admin" && pass === "123456") {
      localStorage.setItem("adminAuth", "true");
      router.push("/admin");
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng nhập Admin</h1>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className="border p-2 w-full mb-3 rounded"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="border p-2 w-full mb-4 rounded"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
