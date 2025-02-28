import { useState } from "react";
import { register } from "../apiClient";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📌 Sending request:", form); // ✅ Debug request
      const res = await register(form);
      console.log("✅ Response:", res); // ✅ Debug response
      setMessage(res.data.message);
    } catch (error) {
      console.error("❌ Register Error:", error.response);
      setMessage(error.response?.data?.error || "สมัครสมาชิกไม่สำเร็จ");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          สมัครสมาชิก
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="ชื่อ"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="อีเมล"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-2 border rounded"
            autoComplete="username" // ✅ เพิ่มตรงนี้
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-2 border rounded"
            autoComplete="new-password" // ✅ สำหรับหน้าสมัครสมาชิก
          />

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            สมัครสมาชิก
          </button>
        </form>
        {message && <p className="mt-2 text-red-500 text-center">{message}</p>}
        <p className="mt-4 text-center text-gray-600">
          มีบัญชีแล้ว?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
