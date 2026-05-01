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

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUsers = useCallback(async () => {
    setLoading(true);
    try {
      const apiUsers = await usersService.getAll();
      setUsers(apiUsers.map((user) => mapApiUserToUser(user)));
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUsers();
  }, []);

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