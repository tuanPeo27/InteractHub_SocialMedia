import axios from 'axios';

const AUTH_TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';

// URL mặc định (production)
const DEFAULT_PROD_API = 'https://interacthub-socialmedia-1.onrender.com/api';

// URL local
const DEFAULT_LOCAL_API = 'http://26.248.122.134:5052/api';

// env từ Vite
const apiEnv = (import.meta as ImportMeta & {
  env?: {
    VITE_API_BASE_URL?: string;
    DEV?: boolean;
  };
}).env;

// Chọn baseURL theo thứ tự ưu tiên:
// 1. ENV cấu hình
// 2. nếu DEV → local
// 3. fallback production
const apiBaseUrl = (
  apiEnv?.VITE_API_BASE_URL ||
  (apiEnv?.DEV ? DEFAULT_LOCAL_API : DEFAULT_PROD_API)
).replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// attach token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// storage helpers
export const authStorage = {
  tokenKey: AUTH_TOKEN_KEY,
  userKey: CURRENT_USER_KEY,
};

export const getStoredAuthToken = () =>
  localStorage.getItem(AUTH_TOKEN_KEY);

export const storeAuthSession = (token: string, userJson: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, userJson);
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};