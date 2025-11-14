// src/services/Admin/orderService.js
import api from "../api.ts";

// Lấy danh sách tất cả đơn hàng (ADMIN/STAFF)
const getAll = async () => {
  const { data } = await api.get("/orders"); // -> GET /api/orders
  return data; // List<OrderDto>
};

// Lấy chi tiết 1 đơn
const getById = async (id) => {
  const { data } = await api.get(`/orders/${id}`); // -> GET /api/orders/{id}
  return data; // OrderDto
};

const adminOrderService = { getAll, getById };
export default adminOrderService;
