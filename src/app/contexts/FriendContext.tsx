import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FriendRequest, User } from '../types';
import { mockFriendRequests, mockUsers } from '../data/mockData';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    if (user) {
      // Load friend requests
      const savedRequests = localStorage.getItem(`friendRequests_${user.id}`);
      if (savedRequests) {
        setFriendRequests(JSON.parse(savedRequests));
      } else {
        const userRequests = mockFriendRequests.filter(
          r => r.toUserId === user.id || r.fromUserId === user.id
        );
        setFriendRequests(userRequests);
        localStorage.setItem(`friendRequests_${user.id}`, JSON.stringify(userRequests));
      }

      // Load friends
      const savedFriends = localStorage.getItem(`friends_${user.id}`);
      if (savedFriends) {
        setFriends(JSON.parse(savedFriends));
      } else {
        const acceptedRequests = mockFriendRequests.filter(
          r => (r.toUserId === user.id || r.fromUserId === user.id) && r.status === 'accepted'
        );
        const friendIds = acceptedRequests.map(r => 
          r.fromUserId === user.id ? r.toUserId : r.fromUserId
        );
        const userFriends = mockUsers.filter(u => friendIds.includes(u.id));
        setFriends(userFriends);
        localStorage.setItem(`friends_${user.id}`, JSON.stringify(userFriends));
      }
    } else {
      setFriendRequests([]);
      setFriends([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`friendRequests_${user.id}`, JSON.stringify(friendRequests));
      localStorage.setItem(`friends_${user.id}`, JSON.stringify(friends));
    }
  }, [friendRequests, friends, user]);

  const sendFriendRequest = (toUserId: string) => {
    if (!user) return;

    const toUser = mockUsers.find(u => u.id === toUserId);
    if (!toUser) return;

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

  const acceptFriendRequest = (requestId: string) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (!request) return;

    setFriendRequests(friendRequests.map(r =>
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    ));

    // Add to friends list
    if (!friends.find(f => f.id === request.fromUserId)) {
      setFriends([...friends, request.fromUser]);
    }
  };

  const rejectFriendRequest = (requestId: string) => {
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
