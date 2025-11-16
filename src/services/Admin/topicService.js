import api from "../api.ts";

const getAllTopics = () => api.get("/topics");
const getTopicById = (id) => api.get(`/topics/id/${id}`);
const getTopicBySlug = (slug) => api.get(`/topics/${slug}`);
const createTopic = (data) => api.post("/topics", data);
const updateTopic = (id, data) => api.put(`/topics/${id}`, data);
const deleteTopic = (id) => api.delete(`/topics/${id}`);

const AdminTopicService = {
  getAllTopics,
  getTopicById,
  getTopicBySlug,
  createTopic,
  updateTopic,
  deleteTopic,
};

export default AdminTopicService;
