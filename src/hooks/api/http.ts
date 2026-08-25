// api/http.ts
import axios from "axios";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const http = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request: attach token
http.interceptors.request.use((config) => {
  const { accessToken } = useAuthenticationStore.getState();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// response: refresh on 401 (no navigation here; just refresh or throw)
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const store = useAuthenticationStore.getState();
    const shouldRefresh =
      error?.response?.status === 401 &&
      store.refreshToken &&
      !(originalRequest as any)?._retry &&
      !originalRequest?.url?.includes("/auth/login") &&
      !originalRequest?.url?.includes("/auth/refresh");

    if (shouldRefresh) {
      (originalRequest as any)._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken: store.refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${store.accessToken}`,
            },
          }
        );

        const { accessToken, refreshToken } = refreshResponse.data || {};
        if (accessToken && refreshToken) {
          useAuthenticationStore.getState().setTokens(accessToken, refreshToken);

          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${accessToken}`,
          };

          return http(originalRequest);
        }
      } catch {
        // fall through to reject
      }
    }

    // Let the caller decide how to handle logout/redirect/toasts
    return Promise.reject(error);
  }
);