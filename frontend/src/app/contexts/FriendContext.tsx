import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FriendRequest, User } from '../types';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';
import { friendsService } from '../services/friendsService';
import { toFrontendFriendRequest } from '../services/mappers';

interface FriendContextType {
  friendRequests: FriendRequest[];
  friends: User[];
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (userId: string) => void;
  getPendingRequests: () => FriendRequest[];
  isFriend: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    const loadFriends = async () => {
      if (!user || usersLoading) {
        setFriendRequests([]);
        setFriends([]);
        return;
      }

      try {
        const friendships = await friendsService.getAll();
        const userLookup = new Map(users.map((item) => [item.id, item] as const));

        const nextFriends = friendships
          .map((friendship) => {
            const friendId = friendship.SenderId === user.id ? friendship.ReceiverId : friendship.SenderId;
            return userLookup.get(friendId);
          })
          .filter((friend): friend is User => Boolean(friend));

        setFriends(nextFriends);
        setFriendRequests(friendships.map((friendship) => toFrontendFriendRequest(friendship, userLookup)));
      } catch {
        setFriendRequests([]);
        setFriends([]);
      }
    };

    void loadFriends();
  }, [user, usersLoading, users.length]);

  useEffect(() => {
    if (!user) {
      setFriendRequests([]);
      setFriends([]);
    }
  }, [friendRequests, friends, user]);

  const sendFriendRequest = async (toUserId: string) => {
    if (!user) return;

    const toUser = users.find(u => u.id === toUserId);
    if (!toUser) return;

    await friendsService.sendRequest(toUserId);

    const newRequest: FriendRequest = {
      id: `fr${Date.now()}`,
      fromUserId: user.id,
      toUserId,
      fromUser: user,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setFriendRequests([...friendRequests, newRequest]);
  };

  const acceptFriendRequest = async (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    await friendsService.accept(requestId);

    setFriendRequests(friendRequests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    ));

    // Add to friends list
    if (!friends.find(f => f.id === request.fromUserId)) {
      setFriends([...friends, request.fromUser]);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    await friendsService.reject(requestId);
    setFriendRequests(friendRequests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const removeFriend = (userId: string) => {
    setFriends(friends.filter(f => f.id !== userId));
    setFriendRequests(friendRequests.filter(r => 
      !(r.fromUserId === userId || r.toUserId === userId)
    ));
  };

  const getPendingRequests = () => {
    if (!user) return [];
    return friendRequests.filter(
      r => r.toUserId === user.id && r.status === 'pending'
    );
  };

  const isFriend = (userId: string) => {
    return friends.some(f => f.id === userId);
  };

  const hasPendingRequest = (userId: string) => {
    if (!user) return false;
    return friendRequests.some(
      r => ((r.fromUserId === user.id && r.toUserId === userId) ||
           (r.fromUserId === userId && r.toUserId === user.id)) &&
          r.status === 'pending'
    );
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        friends,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        removeFriend,
        getPendingRequests,
        isFriend,
        hasPendingRequest,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendContext);
  if (!context) {
    throw new Error('useFriends must be used within FriendProvider');
  }
  return context;
};
