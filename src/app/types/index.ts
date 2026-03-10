export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  images: string[];
  likes: string[]; // user IDs
  comments: Comment[];
  shares: number;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  image: string;
  createdAt: string;
  expiresAt: string;
  views: string[]; // user IDs
}

export interface Notification {
  id: string;
  userId: string; // recipient
  fromUser: User;
  type: 'like' | 'comment' | 'friend_request' | 'friend_accept' | 'share';
  postId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Report {
  id: string;
  postId: string;
  post: Post;
  reportedBy: User;
  reason: string;
  status: 'pending' | 'reviewed' | 'removed';
  createdAt: string;
}
