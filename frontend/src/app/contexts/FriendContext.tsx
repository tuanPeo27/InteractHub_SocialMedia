import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FriendRequest, FriendReceive, User, FriendRequestStatus} from '../types';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';
import { friendsService } from '../services/friendsService';
import { toFrontendFriendRequest } from '../services/mappers';

interface FriendContextType {
  friendRequests: FriendRequest[];
  friends: User[];
  friendReceives: FriendReceive[];
  sendFriendRequest: (toUserId: string) => void;
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (userId: string) => void;
  getPendingRequests: () => FriendReceive[];
  isFriend: (userId: string) => boolean;
  hasPendingRequest: (userId: string) => boolean;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendReceives, setFriendReceives] = useState<FriendReceive[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    const loadFriends = async () => {
      if (!user || usersLoading) {
        setFriendRequests([]);
        setFriendReceives([]);
        setFriends([]);
        return;
      }

      try {
        const friendships = await friendsService.getAll();
        const pendingRequests = await friendsService.recieveedRequests();
        const sentRequests = await friendsService.sentRequests();
        // console.log(pendingRequests);
        const userLookup = new Map(users.map((item) => [item.id, item] as const));

        const nextFriends = friendships
          .map((friendship) => {
            const friendId = friendship.senderId === user.id ? friendship.receiverId : friendship.senderId;
            return userLookup.get(friendId);
          })
          .filter((friend): friend is User => Boolean(friend));

        setFriends(nextFriends);
        setFriendReceives(pendingRequests
          .map((friendship) => toFrontendFriendRequest(friendship, userLookup))
        );
        setFriendRequests(sentRequests.map((sentRequests) => toFrontendFriendRequest(sentRequests, userLookup)));
      } catch {
        setFriendRequests([]);
        setFriendReceives([]);
        setFriends([]);
      }
    };

    void loadFriends();
  }, [user, usersLoading, users]);

  //getPendingRequests
  const getPendingRequests = () => {
    if (!user) return [];
    return friendReceives.filter(
      r => r.toUserId === user.id && r.status === FriendRequestStatus.Pending
    );
  };

  //removeFriend
  const removeFriend = async (userId: string) => {
    await friendsService.removeFriend(userId);

    setFriends(friends.filter(f => f.id !== userId));
    setFriendRequests(friendRequests.filter(r => 
      !(r.fromUserId === userId || r.toUserId === userId)
    ));
  };

  //SendFriendRequest
  const sendFriendRequest = async (toUserId: string) => {
    if (!user) return;

    const toUser = users.find(u => u.id === toUserId);
    if (!toUser) return;
    // console.log(friendRequests);
    
    await friendsService.sendRequest(toUserId);
    
    const newRequest: FriendRequest = {
      id: `fr${Date.now()}`,
      fromUserId: user.id,
      toUserId : toUserId,
      fromUser: user,
      status: FriendRequestStatus.Pending,
      createdAt: new Date().toISOString(),
    };
    
    setFriendRequests([...friendRequests, newRequest]);
  };

  
  const acceptFriendRequest = async (requestId: string) => {
    const request = friendReceives.find(r => r.id === requestId);
    if (!request) return;

    await friendsService.accept(requestId);

    setFriendReceives(friendReceives.map(r =>
      r.id === requestId ? { ...r, status: FriendRequestStatus.Accepted as const } : r
    ));

    // Add to friends list
    if (!friends.find(f => f.id === request.fromUserId)) {
      setFriends([...friends, request.fromUser]);
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    await friendsService.reject(requestId);
    setFriendReceives(friendReceives.map(r =>
      r.id === requestId ? { ...r, status: FriendRequestStatus.Rejected as const } : r
    ));
  };

  const isFriend = (userId: string) => {
    return friends.some(f => f.id === userId);
  };

  const hasPendingRequest = (userId: string) => {
    if (!user) return false;
    return friendRequests.some(
      r => ((r.fromUserId === user.id && r.toUserId === userId) ||
           (r.fromUserId === userId && r.toUserId === user.id)) &&
          r.status === FriendRequestStatus.Pending
    );
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        friendReceives,
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
