// src/services/Client/orderService.js
import api from "../api.ts";

const createOrder = (payload) => api.post("/orders", payload); // -> POST /api/orders

const getMyOrders = () => api.get("/orders/my-orders");

const OrderService = { createOrder, getMyOrders };
export default OrderService;
