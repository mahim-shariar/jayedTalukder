import axios from "axios";

const API_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://jayed-talukder-server.vercel.app/api/v1"
    : "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies to be sent
});

// Request interceptor for adding token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post("/auth/forgotPassword", data);
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.patch(`/auth/resetPassword/${token}`, {
    password,
  });
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.patch("/auth/updatePassword", data);
  return response.data;
};

// Video Reels API
export const getVideoReels = async (params = {}) => {
  const response = await api.get("/video-reels", { params });
  return response.data;
};

export const getVideoReel = async (id) => {
  const response = await api.get(`/video-reels/${id}`);
  return response.data;
};

export const createVideoReel = async (reelData) => {
  const response = await api.post("/video-reels", reelData);
  return response.data;
};

export const updateVideoReel = async (id, reelData) => {
  const response = await api.patch(`/video-reels/${id}`, reelData);
  return response.data;
};

export const deleteVideoReel = async (id) => {
  const response = await api.delete(`/video-reels/${id}`);
  return response.data;
};

// Enhanced Video Reels API with filtering
export const getVideoReelsByCategory = async (category) => {
  const response = await api.get("/video-reels", { params: { category } });
  return response.data;
};

export const getVideoReelsByTags = async (tags) => {
  const response = await api.get("/video-reels", {
    params: { tags: Array.isArray(tags) ? tags.join(",") : tags },
  });
  return response.data;
};

export const searchVideoReels = async (query) => {
  const response = await api.get("/video-reels", {
    params: { search: query },
  });
  return response.data;
};

// Reviews API
export const getReviews = async () => {
  const response = await api.get("/reviews");
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/reviews", reviewData);
  return response.data;
};

export const updateReview = async (id, reviewData) => {
  const response = await api.patch(`/reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

// File Upload API
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default"); // Create this in Cloudinary settings

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) throw new Error("Upload failed");

  const data = await response.json();
  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
};

export default api;
