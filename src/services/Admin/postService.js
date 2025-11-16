import api from "../api.ts";

const getAllPosts = () => api.get("/posts");
const getPostById = (id) => api.get(`/posts/${id}`);
const createPostJson = (data) => api.post("/posts", data);

const createPostForm = (data) =>
  api.post("/posts/form", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ⭐ UPDATE FORM DATA (CÓ FILE)
const updatePostForm = (id, data) =>
  api.put(`/posts/form/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

const updatePost = (id, data) => api.put(`/posts/${id}`, data);
const deletePost = (id) => api.delete(`/posts/${id}`);

const AdminPostService = {
  getAllPosts,
  getPostById,
  createPostJson,
  createPostForm,
  updatePostForm,
  updatePost,
  deletePost,
};

export default AdminPostService;
