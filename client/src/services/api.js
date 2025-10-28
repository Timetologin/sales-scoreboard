import axios from "axios";

// אם יש משתנה סביבה, נשתמש בו, אחרת ברירת מחדל לשרת לוקאלי
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ מוסיף טוקן לכל בקשה במידה והוא שמור בלוקאל סטורג'
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ מטפל בשגיאות תגובה
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =======================
// 🔐 AUTH API
// =======================
export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  getMe: () => api.get("/api/auth/me"),
};

// =======================
// 👥 USERS API
// =======================
export const usersAPI = {
  getLeaderboard: () => api.get("/api/users/leaderboard"),
  getProfile: (id) => api.get(`/api/users/profile/${id}`),
  updateProfile: (data) => api.put("/api/users/profile", data),
  updateFTDs: (id, ftds) => api.put(`/api/users/${id}/ftds`, { ftds }),
  addFTDs: (id, amount) => api.post(`/api/users/${id}/add-ftds`, { amount }),
  incrementFTD: (id) => api.post(`/api/users/${id}/increment-ftd`),
  getAllUsers: () => api.get("/api/users/all"),
  createUser: (userData) => api.post("/api/users/create", userData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  resetLeaderboard: () => api.post("/api/users/reset-leaderboard"),
};

// =======================
// 🤖 AI API
// =======================
export const aiAPI = {
  sendMessage: (message) => api.post("/api/ai/chat", { message }),
};

export default api;