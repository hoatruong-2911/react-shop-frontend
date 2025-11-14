// src/services/Admin/dashboardService.js
import api from "../api.ts"; // dùng cùng instance với productService

const dashboardService = {
  async getSummary() {
    const res = await api.get("/admin/dashboard");
    return res.data;
  },
};

export default dashboardService;
