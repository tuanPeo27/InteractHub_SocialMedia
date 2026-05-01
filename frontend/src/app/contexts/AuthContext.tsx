import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';
import { authService } from '../services/authService';
import { authStorage, getStoredAuthToken, clearAuthSession } from '../services/http';
import { DEFAULT_AVATAR, mapAuthUserToUser } from '../services/mappers';

interface AuthActionResult {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (userData: Partial<User> & { password: string }) => Promise<AuthActionResult>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const resolveAuthErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) {
      return data.message;
    }
  }

  return error instanceof Error ? error.message : 'Đã có lỗi xảy ra!';
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(authStorage.userKey);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => getStoredAuthToken());

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        const existingUser = localStorage.getItem(authStorage.userKey);
        const savedUser = existingUser ? (JSON.parse(existingUser) as User) : null;

        const nextUser = savedUser
          ? {
              ...savedUser,
              ...mapAuthUserToUser(
                {
                  email: currentUser.Email,
                  userName: currentUser.UserName,
                  userId: currentUser.Id,
                  roles: currentUser.UserName?.toLowerCase() === 'admin' ? ['Admin'] : [],
                  primaryRole: currentUser.UserName?.toLowerCase() === 'admin' ? 'Admin' : undefined,
                },
                savedUser,
              ),
            }
          : {
              id: currentUser.Id,
              username: currentUser.UserName || currentUser.Email.split('@')[0],
              email: currentUser.Email,
              fullName: currentUser.FullName || currentUser.UserName || currentUser.Email.split('@')[0],
              avatar: currentUser.Avatar || DEFAULT_AVATAR,
              bio: currentUser.Bio || '',
              followers: 0,
              following: 0,
              createdAt: new Date().toISOString(),
            };

        setUser(nextUser);
        localStorage.setItem(authStorage.userKey, JSON.stringify(nextUser));
      } catch {
        setUser(null);
        setToken(null);
        clearAuthSession();
      }
    };

    void bootstrap();
  }, [token]);

  const persistSession = (nextUser: User, nextToken?: string) => {
    setUser(nextUser);
    localStorage.setItem(authStorage.userKey, JSON.stringify(nextUser));

    if (nextToken) {
      setToken(nextToken);
      localStorage.setItem(authStorage.tokenKey, nextToken);
    }

    authService.storeAuthSession(nextToken || getStoredAuthToken() || '', JSON.stringify(nextUser));
  };

  const login = async (email: string, password: string): Promise<AuthActionResult> => {
    try {
      const response = await authService.login(email, password);

      if (response.success && response.data?.token) {
        const savedUser = localStorage.getItem(authStorage.userKey);
        const existingUser = savedUser ? (JSON.parse(savedUser) as User) : null;
        const nextUser = mapAuthUserToUser(response.data, existingUser);

        persistSession(nextUser, response.data.token);
        return { success: true, message: response.message };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: resolveAuthErrorMessage(error) };
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<AuthActionResult> => {
    try {
      const response = await authService.register(userData.email || '', userData.password);

      if (!response.success) {
        return { success: false, message: response.message };
      }

      const loginResult = await login(userData.email || '', userData.password);

      if (loginResult.success && userData.email) {
        await updateProfile({
          username: userData.username || userData.email.split('@')[0],
          fullName: userData.fullName || userData.username || userData.email.split('@')[0],
          bio: '',
          avatar: DEFAULT_AVATAR,
        });
      }

      return loginResult;
    } catch (error) {
      return { success: false, message: resolveAuthErrorMessage(error) };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthSession();
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      return;
    }

    await authService.updateCurrentUser(data);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem(authStorage.userKey, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
