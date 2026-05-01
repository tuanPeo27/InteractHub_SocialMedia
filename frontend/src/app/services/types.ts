import {
  Comment,
  FriendRequest,
  Notification,
  Post,
  Story,
  User,
  FriendRequestStatus
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
export type LikeUser = {
  userId: string;
  userName: string;
  avatar: string;
  likedAt: string;
};

export interface ApiLikeInfo {
  postId: number;
  totalLikes: number;
  isLiked: boolean;
  users: LikeUser[];
}


export interface ApiFriendship {
  id: number;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
}

export type { Comment, FriendRequest, Notification, Post, Story, User, FriendRequestStatus };
