import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // 👈 tu backend
});

export default API;
