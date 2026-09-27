import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Injection du token d'accès avant chaque requête
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && accessToken !== 'undefined' && accessToken !== 'null') {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Gestion automatique du Refresh Token en cas d'erreur 401
// app/lib/api.ts

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si la requête renvoie 401 et n'a pas encore été réessayée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = typeof window !== "undefined" 
        ? localStorage.getItem("refreshToken") 
        : null;

      // Si aucun refresh token n'est présent, on redirige sans rejeter une erreur bloquante
      if (!refreshToken) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // Rediriger vers la page de connexion si on n'y est pas déjà
          if (!window.location.pathname.startsWith("/connexion")) {
            window.location.href = "/connexion";
          }
        }
        return Promise.reject(error);
      }

      try {
        // Tenter de rafraîchir le jeton
        const res = await api.post("/auth/refresh", { refreshToken });
        const newAccessToken = res.data?.accessToken || res.data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // En cas d'échec du refresh, nettoyer le stockage et rediriger
        if (typeof window !== "undefined") {
          localStorage.clear();
          window.location.href = "/connexion";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);