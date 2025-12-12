import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5179/api", 
});

export default api;
