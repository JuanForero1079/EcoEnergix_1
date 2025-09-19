import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // Cambia el puerto si tu backend usa otro
});

export default API;
