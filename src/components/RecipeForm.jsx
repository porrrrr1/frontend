import { useState } from "react";
import { createRecipe, updateRecipe } from "../apiClient";

export default function RecipeForm({ user, recipe, onClose, onSuccess }) {
  const [title, setTitle] = useState(recipe ? recipe.title : "");
  const [content, setContent] = useState(recipe ? recipe.content : "");
  const [image, setImage] = useState(null);
  const isEdit = !!recipe; // ✅ ตรวจสอบโหมดแก้ไขหรือเพิ่มใหม่

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("authorId", user.id);
    if (image) {
      formData.append("image", image);
    }

    try {
      let newRecipe;
      if (isEdit) {
        newRecipe = await updateRecipe(recipe.id, formData);
      } else {
        newRecipe = await createRecipe(formData);
      }

      onSuccess(newRecipe.data); // ✅ อัปเดตข้อมูลหลังเพิ่ม/แก้ไข
      onClose(); // ✅ ปิดฟอร์ม
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">{isEdit ? "✏️ แก้ไขสูตรอาหาร" : "➕ เพิ่มสูตรอาหาร"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อสูตรอาหาร"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="รายละเอียดสูตรอาหาร"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-2">
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {isEdit ? "✅ บันทึก" : "➕ เพิ่ม"}
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              ❌ ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
