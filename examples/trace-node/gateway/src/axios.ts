import axios from "axios";

export const apiService = axios.create({
  baseURL: process.env.AUTH_SERVICE_BASE_URL ?? "http://localhost:4000",
});
