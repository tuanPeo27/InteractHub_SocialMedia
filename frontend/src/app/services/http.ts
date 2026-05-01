import axios from 'axios';

const DEFAULT_API_BASE_URL = 'http://26.248.122.134:5052/api';
const AUTH_TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';

const apiEnv = (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env;
const apiBaseUrl = (apiEnv?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authStorage = {
  tokenKey: AUTH_TOKEN_KEY,
  userKey: CURRENT_USER_KEY,
};

export const getStoredAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const storeAuthSession = (token: string, userJson: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, userJson);
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};