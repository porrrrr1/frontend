import { useEffect, useState } from "react";
import { getProfile, getRecipes, deleteRecipe } from "../apiClient";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then((response) => setUser(response))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }

    getRecipes()
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleGoToAdmin = () => {
   console.log("Navigating to admin...");
navigate("/admin");
  };

  const handleOpenForm = (recipe = null) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingRecipe(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(recipes.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const confirmDelete = async () => {
    if (recipeToDelete) {
      try {
        await deleteRecipe(recipeToDelete.id);
        setRecipes(recipes.filter((r) => r.id !== recipeToDelete.id));
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
    setShowDeleteConfirm(false);
    setRecipeToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-green-200 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {user ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-700">
              ยินดีต้อนรับ, {user.name} 🎉
            </h1>
            <p className="text-gray-600 mt-2">อีเมล: {user.email}</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
            >
              ออกจากระบบ
            </button>
            {user.role === "admin" && (
              <button
                onClick={handleGoToAdmin}
                className="mt-4 ml-4 bg-gray-700 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
              >
                🛠️ ไปหน้า Admin Dashboard
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-700">📜 สูตรอาหาร</h1>
            <p className="text-gray-500 mt-2">
              กรุณาเข้าสู่ระบบเพื่อเพิ่ม แก้ไข หรือ ลบสูตรอาหาร
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        )}

        <h2 className="text-3xl font-semibold mt-8 text-green-800">
          🥗 สูตรอาหารทั้งหมด
        </h2>
        {recipes.length === 0 ? (
          <p className="text-gray-500 mt-2">ไม่มีสูตรอาหารในระบบ</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="p-5 border rounded-lg shadow-md bg-white hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <img
                  src={`http://localhost:5000${recipe.imageUrl}`}
                  alt="อาหาร"
                  className="w-full h-48 object-cover rounded-md"
                />
                <h3 className="text-xl font-bold mt-3 text-green-800">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {recipe.content}
                </p>

                {/* ✅ แสดงปุ่มถ้าเป็น Admin หรือเจ้าของโพสต์ */}
                {user &&
                  (user.role === "admin" || user.id === recipe.authorId) && (
                    <div className="flex justify-between mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // หยุดการคลิกไม่ให้ไปเปิด Popup
                          handleOpenForm(recipe);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        ✏️ แก้ไข
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRecipeToDelete(recipe); // ตั้งค่าโพสต์ที่ต้องการลบ
                          setShowDeleteConfirm(true); // เปิด Popup
                        }}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        🗑️ ลบ
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="text-center mt-8">
            <button
              onClick={() => handleOpenForm()}
              className="bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition"
            >
              ➕ เพิ่มสูตรอาหาร
            </button>
          </div>
        )}
      </div>

      {selectedRecipe && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedRecipe(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-green-800">
              {selectedRecipe.title}
            </h2>
            <img
              src={`http://localhost:5000${selectedRecipe.imageUrl}`}
              alt="อาหาร"
              className="w-full h-64 object-cover rounded-md mt-4"
            />
            <ul className="list-disc pl-5 text-gray-600 mt-4">
              {selectedRecipe.content.split("\n").map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
            {selectedRecipe?.author?.name ? (
              <p className="text-sm text-gray-500 mt-2">
                โพสต์โดย: {selectedRecipe.author.name}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">ไม่ทราบผู้เขียน</p>
            )}

            <button
              onClick={() => setSelectedRecipe(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-red-600">
              ⚠️ ยืนยันการลบ
            </h2>
            <p className="text-gray-700 mt-2">
              คุณต้องการลบโพสต์ <b>{recipeToDelete?.title}</b> ใช่ไหม?
            </p>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                ✅ ยืนยัน
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                ❌ ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <RecipeForm
          user={user}
          recipe={editingRecipe}
          onClose={handleCloseForm}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
