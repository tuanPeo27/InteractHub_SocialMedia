import { Comment, FriendRequest, Notification, Post, Story, User, FriendRequestStatus } from '../types';
import { ApiComment, ApiFriendship, ApiNotification, ApiPost, ApiStory, ApiUser } from './types';

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1771050889377-b68415885c64?w=200';

const displayNameFromEmail = (email?: string | null) => email?.split('@')[0] || 'Người dùng';

export const mapApiUserToUser = (apiUser: ApiUser, fallbackRole?: string): User => ({
  id: apiUser.id,
  username: apiUser.userName || displayNameFromEmail(apiUser.email),
  email: apiUser.email,
  fullName: apiUser.fullName || apiUser.userName || displayNameFromEmail(apiUser.email),
  avatar: apiUser.avatar || DEFAULT_AVATAR,
  bio: apiUser.bio || '',
  isAdmin: fallbackRole === 'Admin' || apiUser.userName?.toLowerCase() === 'admin',
  createdAt: apiUser.dateOfBirth || new Date().toISOString(),
});

export const mapAuthUserToUser = (
  authData: { email?: string; userName?: string; userId?: string; roles?: string[]; primaryRole?: string },
  existingUser?: User | null,
): User => ({
  id: authData.userId || existingUser?.id || '',
  username: existingUser?.username || authData.userName || displayNameFromEmail(authData.email),
  email: authData.email || existingUser?.email || '',
  fullName: existingUser?.fullName || authData.userName || displayNameFromEmail(authData.email),
  avatar: existingUser?.avatar || DEFAULT_AVATAR,
  bio: existingUser?.bio || '',
  isAdmin: existingUser?.isAdmin || authData.roles?.includes('Admin') || authData.primaryRole === 'Admin',
  createdAt: existingUser?.createdAt || new Date().toISOString(),
});

export const extractHashtags = (content?: string) => {
  if (!content) return [];

  const matches = content.match(/#(\w+)/g);
  return matches ? matches.map((tag) => tag.slice(1)) : [];
};

export const toFrontendPost = (
  apiPost: ApiPost,
  userLookup: Map<string, User>,
  commentLookup: Map<number, ApiComment[]>,
  likeLookup: Map<number, { postId: number; totalLikes: number; isLiked: boolean }>,
  currentUserId?: string,
): Post => {
  const comments = (commentLookup.get(apiPost.id) || []).map((comment) => ({
    id: String(comment.id),
    postId: String(comment.postId),
    userId: comment.userId,
    user: userLookup.get(comment.userId) || mapApiUserToUser({
      id: comment.userId,
      userName: displayNameFromEmail(comment.userId),
      email: `${comment.userId}@interacthub.local`,
      fullName: displayNameFromEmail(comment.userId),
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
    content: comment.content,
    createdAt: comment.createdAt,
  }));

  const likeInfo = likeLookup.get(apiPost.id);
  const likes = likeInfo
    ? [
      ...(likeInfo.isLiked && currentUserId ? [currentUserId] : []),
      ...Array.from(
        { length: Math.max(likeInfo.totalLikes - (likeInfo.isLiked && currentUserId ? 1 : 0), 0) },
        (_, index) => `like-${apiPost.id}-${index}`,
      ),
    ]
    : [];

  const user = userLookup.get(apiPost.userId) || mapApiUserToUser({
    id: apiPost.userId,
    userName: displayNameFromEmail(apiPost.userId),
    email: `${apiPost.userId}@interacthub.local`,
    fullName: displayNameFromEmail(apiPost.userId),
    avatar: DEFAULT_AVATAR,
    bio: '',
    dateOfBirth: null,
  });

  return {
    id: String(apiPost.id),
    userId: apiPost.userId,
    user,
    content: apiPost.content,
    images: apiPost.imageUrl ? [apiPost.imageUrl] : [],
    likes,
    comments,
    shares: 0,
    hashtags: extractHashtags(apiPost.content),
    createdAt: apiPost.createdAt,
    updatedAt: apiPost.updatedAt,
  };
};
export const toFrontendStory = (apiStory: ApiStory, userLookup: Map<string, User>): Story => ({
  id: String(apiStory.id),
  userId: apiStory.userId,
  user:
    userLookup.get(apiStory.userId) ||
    mapApiUserToUser({
      id: apiStory.userId,
      userName: displayNameFromEmail(apiStory.userId),
      email: `${apiStory.userId}@interacthub.local`,
      fullName: displayNameFromEmail(apiStory.userId),
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
  image: apiStory.imageUrl,
  createdAt: apiStory.createdAt,
  expiresAt: new Date(new Date(apiStory.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  views: [],
});

export const toFrontendNotification = (notification: ApiNotification, userLookup: Map<string, User>): Notification => ({
  id: String(notification.id),
  userId: notification.fromUserId || '',
  fromUser:
    (notification.fromUserId && userLookup.get(notification.fromUserId)) ||
    mapApiUserToUser({
      id: notification.fromUserId || 'system',
      userName: notification.fromUserName || 'system',
      email: `${notification.fromUserId || 'system'}@interacthub.local`,
      fullName: notification.fromUserName || 'Hệ thống',
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
  type: (notification.type as Notification['type']) || 'like',
  postId: undefined,
  message: notification.content,
  read: notification.isRead,
  createdAt: notification.createdAt,
});

export const toFrontendFriendRequest = (friendship: ApiFriendship, userLookup: Map<string, User>): FriendRequest => ({
  id: String(friendship.id),
  fromUserId: friendship.senderId,
  toUserId: friendship.receiverId,
  fromUser:
    userLookup.get(friendship.senderId) ||
    mapApiUserToUser({
      id: friendship.senderId,
      userName: displayNameFromEmail(friendship.senderId),
      email: `${friendship.senderId}@interacthub.local`,
      fullName: displayNameFromEmail(friendship.senderId),
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
  status: friendship.status as FriendRequestStatus,
  createdAt: new Date().toISOString(),
});