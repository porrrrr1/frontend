import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📌 Sending request:", form); // ✅ Debug request
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      console.log("✅ Response:", res.data); // ✅ Debug response
  
      localStorage.setItem("token", res.data.token);
  
      if (res.data.user && res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.error || "เข้าสู่ระบบไม่สำเร็จ");
    }
  };
  

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/food-background.jpg')" }}>

      {/* ✅ Gradient Overlay เพื่อให้ข้อความชัดขึ้น */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>

      {/* ✅ Glassmorphism Card */}
      <div className="relative bg-white/20 p-10 rounded-lg shadow-lg w-96 backdrop-blur-md border border-white/30">
        <h1 className="text-3xl font-bold text-center text-white drop-shadow-lg">🍽️ เข้าสู่ระบบ</h1>
        <p className="text-gray-200 text-center mt-2 drop-shadow-md">เข้าสู่โลกของสูตรอาหารแสนอร่อย</p>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border rounded mt-1 bg-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border rounded mt-1 bg-gray-100 focus:ring-2 focus:ring-green-400 focus:border-green-400"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold shadow-md"
          >
            เข้าสู่ระบบ
          </button>

          <p className="mt-4 text-center text-gray-200">
            ยังไม่มีบัญชี?{" "}
            <span
              className="text-green-400 cursor-pointer font-semibold hover:underline"
              onClick={() => navigate("/register")}
            >
              สมัครสมาชิก
            </span>
          </p>
        </form>

        {message && <p className="mt-3 text-red-500 text-center">{message}</p>}
      </div>
    </div>
  );
}
