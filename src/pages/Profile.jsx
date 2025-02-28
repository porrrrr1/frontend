import { useAuth } from "../context/AuthContext.jsx"; 

export default function Profile() {
  const { user } = useAuth(); // ✅ ดึงข้อมูลจาก Context API

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1>
      <p><strong>ชื่อ:</strong> {user.name}</p>
      <p><strong>อีเมล:</strong> {user.email}</p>
      <p><strong>สิทธิ์:</strong> {user.role === "admin" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}</p>
      {user.banned && <p className="text-red-500">บัญชีนี้ถูกแบน</p>}
    </div>
  );
}

