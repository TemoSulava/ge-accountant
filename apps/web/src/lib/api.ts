import axios from "axios";

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await axios.post("/api/v1/auth/refresh", undefined, {
          withCredentials: true
        });
        return api.request(error.config);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
