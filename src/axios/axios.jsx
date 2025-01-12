import axios from "axios";
import { get } from "../storage/storage";

const API_URL = import.meta.env.VITE_APP_API_URl;
const TIMEOUT = 10000;

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: TIMEOUT,
    headers: {
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const accessTokenAdmin = get("ACCESS_TOKEN_ADMIN");
    const accessToken = get("ACCESS_TOKEN");
    if (accessToken) {
      config.headers["X-Customer-Header"] = `Bearer ${accessToken}`;
    }
    if (accessTokenAdmin) {
      config.headers["X-Admin-Header"] = `Bearer ${accessTokenAdmin}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        console.error(
          "Response error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

let axiosInstance = createAxiosInstance();

export const refreshAxiosInstance = () => {
  axiosInstance = createAxiosInstance();
};

export default axiosInstance;
