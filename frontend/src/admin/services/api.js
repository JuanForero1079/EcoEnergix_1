// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api", // 👈 importante el /api
});

export default API;
