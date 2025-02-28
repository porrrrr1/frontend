import { useEffect, useState } from "react";
import { getProfile, getRecipes, approveRecipe, banUser } from "../apiClient";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [recipes, setRecipes] = useState([]); // ✅ ตั้งค่าเริ่มต้นเป็น []
  const navigate = useNavigate();

  // ✅ ตรวจสอบว่าเป็นแอดมินหรือไม่
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await getProfile();
        if (res?.data?.role !== "admin") {
          navigate("/dashboard"); // ❌ ไม่ใช่แอดมิน ส่งไปหน้า dashboard
        } else {
          setAdmin(res.data);
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login"); // ❌ ถ้าไม่ได้ล็อกอิน ส่งไปหน้า login
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // ✅ ดึงโพสต์ที่รออนุมัติ
  useEffect(() => {
    getRecipes()
      .then((data) => setRecipes(data || [])) // ✅ ป้องกัน recipes เป็น undefined
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);
  

  // ✅ อนุมัติโพสต์
  const handleApprove = async (id) => {
    try {
      await approveRecipe(id);
      setRecipes((prevRecipes) =>
        prevRecipes.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
      );
    } catch (error) {
      console.error("Error approving recipe:", error);
    }
  };

  // ✅ แบนผู้ใช้
  const handleBan = async (userId) => {
    try {
      await banUser(userId);
      alert("ผู้ใช้ถูกแบนเรียบร้อย");
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  if (!admin) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">👑 Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">ยินดีต้อนรับ, {admin.name}</p>

        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          ออกจากระบบ
        </button>
        <div className="flex space-x-4 mt-4">
          <button 
            onClick={handleGoToDashboard} 
            className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-600">🔙 ไปหน้า Dashboard
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">📊 สถิติ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-blue-800">จำนวนโพสต์ทั้งหมด</h3>
              <p className="text-2xl text-blue-600">{recipes?.length || 0}</p> {/* ✅ ป้องกัน undefined */}
            </div>
            <div className="p-4 bg-red-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-red-800">จำนวนผู้ใช้ที่ถูกแบน</h3>
              <p className="text-2xl text-red-600">{/* จำนวนผู้ใช้ที่ถูกแบน */}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-6 mb-4">📌 โพสต์ที่รออนุมัติ</h2>
        {recipes?.filter((r) => !r.isApproved)?.length === 0 ? (
          <p className="text-gray-500 mt-2">ไม่มีโพสต์ที่รออนุมัติ</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {recipes
              .filter((r) => !r.isApproved)
              .map((recipe) => (
                <li key={recipe.id} className="p-4 border rounded shadow-sm bg-gray-50">
                  <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-2">{recipe.content}</p>
                  <p className="text-sm text-gray-500 mb-4">โพสต์โดย: {recipe.author?.name}</p>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(recipe.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      ✅ อนุมัติ
                    </button>

                    <button
                      onClick={() => handleBan(recipe.authorId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🚫 แบนผู้ใช้
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
