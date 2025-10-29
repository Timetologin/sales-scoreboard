import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
};

export const usersAPI = {
  getLeaderboard: () => api.get("/users/leaderboard"),
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (data) => api.put("/users/profile", data),
  
  // FTD's endpoints
  updateFTDs: (id, ftds) => api.put(`/users/${id}/ftds`, { ftds }),
  addFTDs: (id, amount) => api.post(`/users/${id}/add-ftds`, { amount }),
  incrementFTD: (id) => api.post(`/users/${id}/increment-ftd`),
  
  // Plus Ones endpoints
  updatePlusOnes: (id, plusOnes) => api.put(`/users/${id}/plusones`, { plusOnes }),
  incrementPlusOne: (id) => api.post(`/users/${id}/increment-plusone`),
  
  // Admin user management endpoints - NEW!
  editUser: (id, userData) => api.put(`/users/${id}/edit`, userData),
  resetPassword: (id, newPassword) => api.put(`/users/${id}/reset-password`, { newPassword }),
  toggleAdmin: (id) => api.put(`/users/${id}/toggle-admin`),
  
  // Admin endpoints
  getAllUsers: () => api.get("/users/all"),
  createUser: (userData) => api.post("/users/create", userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  resetLeaderboard: () => api.post("/users/reset-leaderboard"),
};

export const aiAPI = {
  sendMessage: (message) => api.post("/ai/chat", { message }),
};

export default api;