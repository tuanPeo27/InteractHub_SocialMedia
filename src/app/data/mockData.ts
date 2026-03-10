import { User, Post, Story, Notification, FriendRequest } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'nguyenvana',
    email: 'nguyenvana@example.com',
    fullName: 'Nguyễn Văn A',
    avatar: 'https://images.unsplash.com/photo-1771050889377-b68415885c64?w=200',
    bio: 'Yêu thích công nghệ và du lịch 🚀',
    followers: 1234,
    following: 567,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '2',
    username: 'tranthib',
    email: 'tranthib@example.com',
    fullName: 'Trần Thị B',
    avatar: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?w=200',
    bio: 'Designer | Artist | Coffee lover ☕',
    followers: 2341,
    following: 890,
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: '3',
    username: 'levanc',
    email: 'levanc@example.com',
    fullName: 'Lê Văn C',
    avatar: 'https://images.unsplash.com/photo-1543132220-e7fef0b974e7?w=200',
    bio: 'Photographer & Traveler 📸',
    followers: 3456,
    following: 1234,
    createdAt: '2024-03-05T14:20:00Z',
  },
  {
    id: '4',
    username: 'phamthid',
    email: 'phamthid@example.com',
    fullName: 'Phạm Thị D',
    avatar: 'https://images.unsplash.com/photo-1590441613122-d8777e0b4445?w=200',
    bio: 'Foodie | Blogger | Life enthusiast 🍜',
    followers: 5678,
    following: 2345,
    createdAt: '2024-01-10T09:15:00Z',
  },
  {
    id: 'admin',
    username: 'admin',
    email: 'admin@interacthub.com',
    fullName: 'Admin InteractHub',
    avatar: 'https://images.unsplash.com/photo-1771050889377-b68415885c64?w=200',
    bio: 'Quản trị viên hệ thống',
    followers: 10000,
    following: 100,
    isAdmin: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
];

export const mockPosts: Post[] = [
  {
    id: 'p1',
    userId: '3',
    user: mockUsers[2],
    content: 'Hành trình chinh phục đỉnh núi tuyệt đẹp! Cảm giác thật tuyệt vời khi đứng trên đỉnh nhìn xuống. #travel #mountain #adventure',
    images: ['https://images.unsplash.com/photo-1598439473183-42c9301db5dc?w=800'],
    likes: ['1', '2', '4'],
    comments: [
      {
        id: 'c1',
        postId: 'p1',
        userId: '1',
        user: mockUsers[0],
        content: 'Tuyệt vời quá! Đỉnh núi nào vậy bạn?',
        createdAt: '2026-03-10T10:30:00Z',
      },
      {
        id: 'c2',
        postId: 'p1',
        userId: '2',
        user: mockUsers[1],
        content: 'Ảnh đẹp quá! 😍',
        createdAt: '2026-03-10T11:00:00Z',
      },
    ],
    shares: 5,
    hashtags: ['travel', 'mountain', 'adventure'],
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  },
  {
    id: 'p2',
    userId: '4',
    user: mockUsers[3],
    content: 'Món ăn mới thử hôm nay! Ai đã từng ăn chưa nhỉ? #foodie #delicious #yummy',
    images: ['https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=800'],
    likes: ['1', '2', '3'],
    comments: [
      {
        id: 'c3',
        postId: 'p2',
        userId: '1',
        user: mockUsers[0],
        content: 'Trông ngon quá! Ở đâu vậy bạn?',
        createdAt: '2026-03-10T12:00:00Z',
      },
    ],
    shares: 3,
    hashtags: ['foodie', 'delicious', 'yummy'],
    createdAt: '2026-03-09T18:30:00Z',
    updatedAt: '2026-03-09T18:30:00Z',
  },
  {
    id: 'p3',
    userId: '2',
    user: mockUsers[1],
    content: 'Khung cảnh thành phố về đêm thật đẹp! #citylife #architecture #nightview',
    images: ['https://images.unsplash.com/photo-1668906756110-784c9f31409e?w=800'],
    likes: ['1', '3', '4'],
    comments: [],
    shares: 8,
    hashtags: ['citylife', 'architecture', 'nightview'],
    createdAt: '2026-03-09T20:00:00Z',
    updatedAt: '2026-03-09T20:00:00Z',
  },
  {
    id: 'p4',
    userId: '1',
    user: mockUsers[0],
    content: 'Hoàng hôn trên biển 🌅 Cảm giác bình yên tuyệt vời! #beach #sunset #peaceful',
    images: ['https://images.unsplash.com/photo-1697809311064-c7a3852206ee?w=800'],
    likes: ['2', '3', '4'],
    comments: [
      {
        id: 'c4',
        postId: 'p4',
        userId: '2',
        user: mockUsers[1],
        content: 'Đẹp quá! Mình cũng muốn đi biển lắm 😊',
        createdAt: '2026-03-09T15:00:00Z',
      },
      {
        id: 'c5',
        postId: 'p4',
        userId: '3',
        user: mockUsers[2],
        content: 'Ảnh chụp bằng máy gì vậy bạn?',
        createdAt: '2026-03-09T15:30:00Z',
      },
    ],
    shares: 12,
    hashtags: ['beach', 'sunset', 'peaceful'],
    createdAt: '2026-03-09T14:00:00Z',
    updatedAt: '2026-03-09T14:00:00Z',
  },
];

export const mockStories: Story[] = [
  {
    id: 's1',
    userId: '2',
    user: mockUsers[1],
    image: 'https://images.unsplash.com/photo-1762898842219-ca8136061b76?w=400',
    createdAt: '2026-03-10T06:00:00Z',
    expiresAt: '2026-03-11T06:00:00Z',
    views: ['1', '3'],
  },
  {
    id: 's2',
    userId: '3',
    user: mockUsers[2],
    image: 'https://images.unsplash.com/photo-1598439473183-42c9301db5dc?w=400',
    createdAt: '2026-03-10T07:30:00Z',
    expiresAt: '2026-03-11T07:30:00Z',
    views: ['1'],
  },
  {
    id: 's3',
    userId: '4',
    user: mockUsers[3],
    image: 'https://images.unsplash.com/photo-1697809311064-c7a3852206ee?w=400',
    createdAt: '2026-03-10T05:00:00Z',
    expiresAt: '2026-03-11T05:00:00Z',
    views: ['1', '2', '3'],
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    fromUser: mockUsers[1],
    type: 'like',
    postId: 'p4',
    message: 'đã thích bài viết của bạn',
    read: false,
    createdAt: '2026-03-10T09:00:00Z',
  },
  {
    id: 'n2',
    userId: '1',
    fromUser: mockUsers[2],
    type: 'comment',
    postId: 'p4',
    message: 'đã bình luận về bài viết của bạn',
    read: false,
    createdAt: '2026-03-10T08:30:00Z',
  },
  {
    id: 'n3',
    userId: '1',
    fromUser: mockUsers[3],
    type: 'friend_request',
    message: 'đã gửi lời mời kết bạn',
    read: true,
    createdAt: '2026-03-09T16:00:00Z',
  },
];

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'fr1',
    fromUserId: '2',
    toUserId: '1',
    fromUser: mockUsers[1],
    status: 'accepted',
    createdAt: '2026-03-08T10:00:00Z',
  },
  {
    id: 'fr2',
    fromUserId: '3',
    toUserId: '1',
    fromUser: mockUsers[2],
    status: 'accepted',
    createdAt: '2026-03-07T14:00:00Z',
  },
  {
    id: 'fr3',
    fromUserId: '4',
    toUserId: '1',
    fromUser: mockUsers[3],
    status: 'pending',
    createdAt: '2026-03-09T16:00:00Z',
  },
];

export const getTrendingHashtags = (): { tag: string; count: number }[] => {
  const hashtagCounts: { [key: string]: number } = {};
  
  mockPosts.forEach(post => {
    post.hashtags.forEach(tag => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(hashtagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};
