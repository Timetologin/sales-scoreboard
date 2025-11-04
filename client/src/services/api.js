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
  
  // Admin: עבור עדכון profile של משתמשים אחרים
  updateUserProfile: (id, data) => api.put(`/users/${id}/profile`, data),
  
  // FTD's endpoints
  updateFTDs: (id, ftds) => api.put(`/users/${id}/ftds`, { ftds }),
  addFTDs: (id, amount) => api.post(`/users/${id}/add-ftds`, { amount }),
  incrementFTD: (id) => api.post(`/users/${id}/ftd/increment`),
  decrementFTD: (id) => api.post(`/users/${id}/ftd/decrement`),
  
  // Plus Ones endpoints
  updatePlusOnes: (id, plusOnes) => api.put(`/users/${id}/plusones`, { plusOnes }),
  incrementPlusOne: (id) => api.post(`/users/${id}/plusone/increment`),
  decrementPlusOne: (id) => api.post(`/users/${id}/plusone/decrement`),
  
  // ⭐ NEW: Daily Target endpoint
  updateDailyTarget: (id, dailyTarget) => api.put(`/users/${id}/daily-target`, { dailyTarget }),
  
  // Admin user management endpoints
  editUser: (id, userData) => api.put(`/users/${id}/edit`, userData),
  changePassword: (id, newPassword) => api.put(`/users/${id}/reset-password`, { newPassword }),
  resetPassword: (id, newPassword) => api.put(`/users/${id}/reset-password`, { newPassword }),
  toggleAdmin: (id) => api.put(`/users/${id}/toggle-admin`),
  
  // Admin endpoints
  getAllUsers: () => api.get("/users/all"),
  createUser: (userData) => api.post("/users/create", userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  resetLeaderboard: () => api.post("/users/reset-leaderboard"),
};

// ⭐ NEW: Settings API
export const settingsAPI = {
  getMonthlyTarget: () => api.get("/settings/monthly-target"),
  updateMonthlyTarget: (monthlyTarget) => api.put("/settings/monthly-target", { monthlyTarget }),
};

export const aiAPI = {
  sendMessage: (message) => api.post("/ai/chat", { message }),
};

// ⭐ NEW: Notes API
export const notesAPI = {
  // Get my notes
  getMyNotes: () => api.get("/notes"),
  
  // Get all notes (Admin only)
  getAllNotes: () => api.get("/notes/all"),
  
  // Create note
  createNote: (noteData) => api.post("/notes", noteData),
  
  // Update note
  updateNote: (noteId, noteData) => api.put(`/notes/${noteId}`, noteData),
  
  // Delete note
  deleteNote: (noteId) => api.delete(`/notes/${noteId}`),
};

export default api;