// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api", // 👈 importante usar localhost, no 127.0.0.1
});

export default API;
