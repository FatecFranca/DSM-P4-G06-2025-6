import axios from "axios";

// Configuração base da API com variáveis de ambiente
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    "Content-Type": "application/json",
  }
});

// Interceptor para adicionar o token JWT automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para tratar erros globais
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response?.status === 401) {
    // Token expirado ou inválido - redireciona para login
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

export default api;