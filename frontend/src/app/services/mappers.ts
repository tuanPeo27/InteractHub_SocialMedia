import { Comment, FriendRequest, Notification, Post, Story, User } from '../types';
import { ApiComment, ApiFriendship, ApiNotification, ApiPost, ApiStory, ApiUser } from './types';

export const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1771050889377-b68415885c64?w=200';

const displayNameFromEmail = (email?: string | null) => email?.split('@')[0] || 'Người dùng';

export const mapApiUserToUser = (apiUser: ApiUser, fallbackRole?: string): User => ({
  id: apiUser.Id,
  username: apiUser.UserName || displayNameFromEmail(apiUser.Email),
  email: apiUser.Email,
  fullName: apiUser.FullName || apiUser.UserName || displayNameFromEmail(apiUser.Email),
  avatar: apiUser.Avatar || DEFAULT_AVATAR,
  bio: apiUser.Bio || '',
  followers: 0,
  following: 0,
  isAdmin: fallbackRole === 'Admin' || apiUser.UserName?.toLowerCase() === 'admin',
  createdAt: apiUser.DateOfBirth || new Date().toISOString(),
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
  followers: existingUser?.followers ?? 0,
  following: existingUser?.following ?? 0,
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
  likeLookup: Map<number, { PostId: number; TotalLikes: number; IsLiked: boolean }>,
  currentUserId?: string,
): Post => {

  // đảm bảo id luôn tồn tại
  const postId = apiPost?.id ?? 0;

  // content safe 
  const content = apiPost?.content ?? '';

  // COMMENTS
  const comments = (commentLookup.get(postId) || []).map((comment) => ({
    id: String(comment.Id),
    postId: String(comment.PostId),
    userId: comment.UserId,
    user:
      userLookup.get(comment.UserId) ||
      mapApiUserToUser({
        Id: comment.UserId,
        UserName: displayNameFromEmail(comment.UserId),
        Email: `${comment.UserId}@interacthub.local`,
        FullName: displayNameFromEmail(comment.UserId),
        Avatar: DEFAULT_AVATAR,
        Bio: '',
        DateOfBirth: null,
      }),
    content: comment.Content,
    createdAt: comment.CreatedAt,
  }));

  // LIKE
  const likeInfo = likeLookup.get(postId);

  const likes = likeInfo
    ? [
      ...(likeInfo.IsLiked && currentUserId ? [currentUserId] : []),
      ...Array.from(
        {
          length: Math.max(
            likeInfo.TotalLikes - (likeInfo.IsLiked && currentUserId ? 1 : 0),
            0
          ),
        },
        (_, index) => `like-${postId}-${index}`,
      ),
    ]
    : [];

  // USER
  const user =
    userLookup.get(apiPost.userId) ||
    mapApiUserToUser({
      Id: apiPost.userId,
      UserName: displayNameFromEmail(apiPost.userId),
      Email: `${apiPost.userId}@interacthub.local`,
      FullName: displayNameFromEmail(apiPost.userId),
      Avatar: DEFAULT_AVATAR,
      Bio: '',
      DateOfBirth: null,
    });

  return {
    id: String(postId),
    userId: apiPost.userId,
    user,
    content,
    images: apiPost.imageUrl ? [apiPost.imageUrl] : [],
    likes,
    comments,
    shares: 0,
    hashtags: extractHashtags(content), // đã safe
    createdAt: apiPost.createdAt ?? new Date().toISOString(),
    updatedAt: apiPost.updatedAt ?? new Date().toISOString(),
  };
};
export const toFrontendStory = (apiStory: ApiStory, userLookup: Map<string, User>): Story => ({
  id: String(apiStory.Id),
  userId: apiStory.UserId,
  user:
    userLookup.get(apiStory.UserId) ||
    mapApiUserToUser({
      Id: apiStory.UserId,
      UserName: displayNameFromEmail(apiStory.UserId),
      Email: `${apiStory.UserId}@interacthub.local`,
      FullName: displayNameFromEmail(apiStory.UserId),
      Avatar: DEFAULT_AVATAR,
      Bio: '',
      DateOfBirth: null,
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
      Id: notification.FromUserId || 'system',
      UserName: notification.FromUserName || 'system',
      Email: `${notification.FromUserId || 'system'}@interacthub.local`,
      FullName: notification.FromUserName || 'Hệ thống',
      Avatar: DEFAULT_AVATAR,
      Bio: '',
      DateOfBirth: null,
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
      Id: friendship.SenderId,
      UserName: displayNameFromEmail(friendship.SenderId),
      Email: `${friendship.SenderId}@interacthub.local`,
      FullName: displayNameFromEmail(friendship.SenderId),
      Avatar: DEFAULT_AVATAR,
      Bio: '',
      DateOfBirth: null,
    }),
  status: (friendship.Status.toLowerCase() as FriendRequest['status']) || 'pending',
  createdAt: new Date().toISOString(),
});