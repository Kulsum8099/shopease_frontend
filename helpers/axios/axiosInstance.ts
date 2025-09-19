import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://192.168.0.100:4000/api/v1",
  // baseURL: "http://192.168.100.223:4000/api/v1",
  baseURL: "https://shopeasebackend-production.up.railway.app/api/v1",
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      window.location.pathname !== '/login'
      && !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh-token");
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

