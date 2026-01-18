import axios from "axios";

// Use relative URLs in production to avoid CORS issues
// This works because the API routes are in the same Next.js app
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : ""; // Empty string means relative URLs - same origin

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
