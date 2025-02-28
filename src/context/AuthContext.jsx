import axios from 'axios';
import { createContext, useContext, useState } from "react";

// ✅ สร้าง Context
const AuthContext = createContext();

// ✅ สร้าง Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ ใช้งาน Context ได้ง่ายขึ้น
export const useAuth = () => useContext(AuthContext);

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  console.log("Token in localStorage:", token); // ✅ ตรวจสอบ Token
  if (!token) return null;

  try {
    const res = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    console.log("User Data:", res.data); // ✅ ตรวจสอบข้อมูลที่ดึงมา
    return res.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data?.error);
    return null;
  }
};
