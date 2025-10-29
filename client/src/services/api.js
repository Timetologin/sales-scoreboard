import axios from "axios";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
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

// Handle response errors
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
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
};

// =======================
// 👥 USERS API
// =======================
export const usersAPI = {
  getLeaderboard: () => api.get("/users/leaderboard"),
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => api.put("/users/profile", data),
  updateFTDs: (id, ftds) => api.put(`/users/${id}/ftds`, { ftds }),
  addFTDs: (id, amount) => api.post(`/users/${id}/add-ftds`, { amount }),
  incrementFTD: (id) => api.post(`/users/${id}/increment-ftd`),
  getAllUsers: () => api.get("/users/all"),
  createUser: (userData) => api.post("/users/create", userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  resetLeaderboard: () => api.post("/users/reset-leaderboard"),
};

// =======================
// 🤖 AI API
// =======================
export const aiAPI = {
  sendMessage: (message) => api.post("/ai/chat", { message }),
};

export default api;