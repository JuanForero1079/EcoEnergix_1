import axios from "axios";

const APIAdmin = axios.create({
  baseURL: "http://localhost:3001/api/admin",
});

export default APIAdmin;
