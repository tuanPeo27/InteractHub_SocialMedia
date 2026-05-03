import {
  Comment,
  FriendRequest,
  Notification,
  Post,
  Story,
  User,
} from "../types";

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
  phoneNumber?: string | null;
  createdAt: string;
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
  id: number;
  imageUrl: string;
  userId: string;
  createdAt: string;
}

export interface ApiNotification {
  id: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  fromUserId?: string | null;
  fromUserName?: string | null;
  type?: string | null;
}

export interface ApiComment {
  id: number;
  content: string;
  userId: string;
  postId: number;
  createdAt: string;
}

export interface ApiLikeInfo {
  postId: number;
  totalLikes: number;
  isLiked: boolean;
}

export interface ApiLikeUser {
  userId: string;
  userName: string;
  avatar?: string | null;
  likedAt: string;
}

export interface ApiLikeDetail extends ApiLikeInfo {
  isLikedByCurrentUser: boolean;
  users: ApiLikeUser[];
}

export interface ApiFriendship {
  id: number;
  senderId: string;
  receiverId: string;
  status: string | number;
}

export interface ApiAdminUser {
  id: string;
  userName: string;
  email: string;
  isLocked: boolean;
  roles?: string[];
  fullName?: string | null;
  phoneNumber?: string | null;
  avatar?: string | null;
  bio?: string | null;
  dateOfBirth?: string | null;
}

export interface ApiReport {
  id: number;
  postId: number;
  reason: string;
  userName: string;
  createdAt: string;
}

export type {
  Comment,
  FriendRequest,
  Notification,
  Post,
  Story,
  User,
};