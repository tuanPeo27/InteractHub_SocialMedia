import { Comment, FriendRequest, Notification, Post, Story, User, FriendRequestStatus } from '../types';

export interface ApiAuthResult {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    email?: string;
    userName?: string;
    userId?: string;
    roles?: string[];
    primaryRole?: string;
  };
  errors?: unknown;
}

export interface ApiUser {
  id: string;
  userName: string;
  email: string;
  fullName?: string | null;
  avatar?: string | null;
  bio?: string | null;
  dateOfBirth?: string | null;
}

export interface ApiPost {
  Id: number;
  Content: string;
  ImageUrl?: string | null;
  UserId: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ApiStory {
  Id: number;
  ImageUrl: string;
  UserId: string;
  CreatedAt: string;
}

export interface ApiNotification {
  Id: number;
  Content: string;
  IsRead: boolean;
  CreatedAt: string;
  FromUserId?: string | null;
  FromUserName?: string | null;
  Type?: string | null;
}

export interface ApiComment {
  Id: number;
  Content: string;
  UserId: string;
  PostId: number;
  CreatedAt: string;
}

export interface ApiLikeInfo {
  PostId: number;
  TotalLikes: number;
  IsLiked: boolean;
}

export interface ApiFriendship {
  Id: number;
  SenderId: string;
  ReceiverId: string;
  Status: FriendRequestStatus;
}

export type { Comment, FriendRequest, Notification, Post, Story, User, FriendRequestStatus };