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

export const extractHashtags = (content: string) => {
  const matches = content.match(/#(\w+)/g);
  return matches ? matches.map((tag) => tag.slice(1)) : [];
};

export const toFrontendPost = (
  apiPost: ApiPost,
  userLookup: Map<string, User>,
  commentLookup: Map<number, ApiComment[]>,
  likeLookup: Map<number, { PostId: number; TotalLikes: number; IsLiked: boolean }>,
  currentUserId?: string,
): Post => {
  const comments = (commentLookup.get(apiPost.Id) || []).map((comment) => ({
    id: String(comment.Id),
    postId: String(comment.PostId),
    userId: comment.UserId,
    user: userLookup.get(comment.UserId) || mapApiUserToUser({
      id: comment.UserId,
      userName: displayNameFromEmail(comment.UserId),
      email: `${comment.UserId}@interacthub.local`,
      fullName: displayNameFromEmail(comment.UserId),
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
    content: comment.Content,
    createdAt: comment.CreatedAt,
  }));

  const likeInfo = likeLookup.get(apiPost.Id);
  const likes = likeInfo
    ? [
        ...(likeInfo.IsLiked && currentUserId ? [currentUserId] : []),
        ...Array.from(
          { length: Math.max(likeInfo.TotalLikes - (likeInfo.IsLiked && currentUserId ? 1 : 0), 0) },
          (_, index) => `like-${apiPost.Id}-${index}`,
        ),
      ]
    : [];

  const user = userLookup.get(apiPost.UserId) || mapApiUserToUser({
    id: apiPost.UserId,
    userName: displayNameFromEmail(apiPost.UserId),
    email: `${apiPost.UserId}@interacthub.local`,
    fullName: displayNameFromEmail(apiPost.UserId),
    avatar: DEFAULT_AVATAR,
    bio: '',
    dateOfBirth: null,
  });

  return {
    id: String(apiPost.Id),
    userId: apiPost.UserId,
    user,
    content: apiPost.Content,
    images: apiPost.ImageUrl ? [apiPost.ImageUrl] : [],
    likes,
    comments,
    shares: 0,
    hashtags: extractHashtags(apiPost.Content),
    createdAt: apiPost.CreatedAt,
    updatedAt: apiPost.UpdatedAt,
  };
};

export const toFrontendStory = (apiStory: ApiStory, userLookup: Map<string, User>): Story => ({
  id: String(apiStory.Id),
  userId: apiStory.UserId,
  user:
    userLookup.get(apiStory.UserId) ||
    mapApiUserToUser({
      id: apiStory.UserId,
      userName: displayNameFromEmail(apiStory.UserId),
      email: `${apiStory.UserId}@interacthub.local`,
      fullName: displayNameFromEmail(apiStory.UserId),
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
  image: apiStory.ImageUrl,
  createdAt: apiStory.CreatedAt,
  expiresAt: new Date(new Date(apiStory.CreatedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
  views: [],
});

export const toFrontendNotification = (notification: ApiNotification, userLookup: Map<string, User>): Notification => ({
  id: String(notification.Id),
  userId: notification.FromUserId || '',
  fromUser:
    (notification.FromUserId && userLookup.get(notification.FromUserId)) ||
    mapApiUserToUser({
      id: notification.FromUserId || 'system',
      userName: notification.FromUserName || 'system',
      email: `${notification.FromUserId || 'system'}@interacthub.local`,
      fullName: notification.FromUserName || 'Hệ thống',
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
  type: (notification.Type as Notification['type']) || 'like',
  postId: undefined,
  message: notification.Content,
  read: notification.IsRead,
  createdAt: notification.CreatedAt,
});

export const toFrontendFriendRequest = (friendship: ApiFriendship, userLookup: Map<string, User>): FriendRequest => ({
  id: String(friendship.Id),
  fromUserId: friendship.SenderId,
  toUserId: friendship.ReceiverId,
  fromUser:
    userLookup.get(friendship.SenderId) ||
    mapApiUserToUser({
      id: friendship.SenderId,
      userName: displayNameFromEmail(friendship.SenderId),
      email: `${friendship.SenderId}@interacthub.local`,
      fullName: displayNameFromEmail(friendship.SenderId),
      avatar: DEFAULT_AVATAR,
      bio: '',
      dateOfBirth: null,
    }),
  status: friendship.Status as FriendRequestStatus,
  createdAt: new Date().toISOString(),
});