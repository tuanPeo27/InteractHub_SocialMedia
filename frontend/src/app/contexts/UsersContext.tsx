import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { usersService } from '../services/usersService';
import { mapApiUserToUser } from '../services/mappers';

interface UsersContextType {
  users: User[];
  loading: boolean;
  refreshUsers: () => Promise<void>;
  getUserById: (userId: string) => User | undefined;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);
const usersCacheKey = 'interacthub_users_cache';

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const cached = localStorage.getItem(usersCacheKey);
    if (!cached) {
      return [];
    }

    try {
      return JSON.parse(cached) as User[];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => users.length === 0);

  const refreshUsers = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setLoading(true);
    }
    try {
      const apiUsers = await usersService.getAll();
      // console.log("API USERS:", apiUsers); // 👈 thêm dòng này
      const mappedUsers = apiUsers.map((user) => mapApiUserToUser(user));
      setUsers(mappedUsers);
      localStorage.setItem(usersCacheKey, JSON.stringify(mappedUsers));
    } catch (error) {
      console.error("ERROR USERS:", error); // 👈 thêm dòng này
      if (users.length === 0) {
        setUsers([]);
      }
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  }, [users.length]);

  useEffect(() => {

    void refreshUsers({ silent: users.length > 0 });
  }, [refreshUsers, users.length]);

  const getUserById = (userId: string) => users.find((user) => user.id === userId);

  const value = useMemo(
    () => ({ users, loading, refreshUsers, getUserById }),
    [users, loading, refreshUsers],
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within UsersProvider');
  }

  return context;
};