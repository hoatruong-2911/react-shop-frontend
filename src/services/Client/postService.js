// src/services/Client/postService.js
import api from "../api.ts";

// Lấy tất cả bài viết (có thể filter theo topic)
export const getAllPosts = (topicId) =>
  api.get("/posts", {
    params: {
      topicId: topicId || undefined,
      _t: Date.now(), // tránh cache
    },
  });

// Lấy 1 bài viết theo id
export const getPostById = (id) => api.get(`/posts/${id}`);

const ClientPostService = {
  getAllPosts,
  getPostById,
};

export default ClientPostService;
