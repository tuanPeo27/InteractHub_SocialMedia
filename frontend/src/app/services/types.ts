import { Comment, FriendRequest, Notification, Post, Story, User } from '../types';

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
  Id: string;
  UserName: string;
  Email: string;
  FullName?: string | null;
  Avatar?: string | null;
  Bio?: string | null;
  DateOfBirth?: string | null;
}

export interface ApiPost {
  id: number;
  content: string;
  imageUrl?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
  Status: string;
}

export type { Comment, FriendRequest, Notification, Post, Story, User };