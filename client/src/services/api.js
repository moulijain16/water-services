import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Customers
export const fetchCustomers = (params = {}) => api.get("/customers", { params });
export const fetchCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const fetchDashboardStats = () => api.get("/customers/stats/summary");
export const login = (username, password) => api.post("/auth/login", { username, password });
export const signup = (username, password) => api.post("/auth/signup", { username, password });

// Service history (nested under a customer)
export const addServiceRecord = (customerId, data) => api.post(`/customers/${customerId}/service`, data);

export default api;