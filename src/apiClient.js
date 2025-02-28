import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ ดักจับ Token หมดอายุ
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ✅ ใช้ Named Export ตามปกติ
export function register(userData) {
  return fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
}


// export function login(userData) {
//   return fetch('/api/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   }).then((res) => res.json());
// }

export const getProfile = async () => {
  try {
    const response = await API.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const approveRecipe = async (id) => {
  try {
    const response = await API.put(`/recipes/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving recipe:", error);
    return null;
  }
};
export const banUser = async (userId) => {
  try {
    const response = await API.put(`/users/${userId}/ban`);
    return response.data;
  } catch (error) {
    console.error("Error banning user:", error);
    return null;
  }
};

// ✅ API สำหรับสูตรอาหาร
export const getRecipes = async () => {
  try {
    const response = await API.get("/recipes");
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
};

export const createRecipe = (data) =>
  API.post("/recipes", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateRecipe = (id, data) =>
  API.put(`/recipes/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteRecipe = (id) => API.delete(`/recipes/${id}`);
