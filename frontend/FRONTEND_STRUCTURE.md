# InteractHub - Social Media Web Application

## 📋 Tổng quan dự án

InteractHub là một ứng dụng mạng xã hội full-stack được xây dựng bằng React, TypeScript, và Tailwind CSS. Ứng dụng cung cấp đầy đủ các tính năng của một mạng xã hội hiện đại.

## ✨ Tính năng chính

### 1. Xác thực người dùng
- ✅ Đăng ký tài khoản mới với validation
- ✅ Đăng nhập với email/password
- ✅ Đăng xuất
- ✅ Protected routes

### 2. Quản lý bài viết
- ✅ Tạo bài viết với text và hình ảnh (tối đa 4 ảnh)
- ✅ Upload và preview hình ảnh
- ✅ Sử dụng hashtags (#tag)
- ✅ Like/Unlike bài viết
- ✅ Bình luận trên bài viết
- ✅ Chia sẻ bài viết
- ✅ Xóa bài viết của chính mình
- ✅ Báo cáo bài viết vi phạm

### 3. Story (Nội dung tạm thời)
- ✅ Tạo story với hình ảnh
- ✅ Xem story của bạn bè
- ✅ Story tự động hết hạn sau 24 giờ
- ✅ Đếm lượt xem story

### 4. Quản lý bạn bè
- ✅ Gửi lời mời kết bạn
- ✅ Chấp nhận/Từ chối lời mời
- ✅ Danh sách bạn bè
- ✅ Hủy kết bạn
- ✅ Gợi ý kết bạn

### 5. Thông báo
- ✅ Thông báo khi có người like bài viết
- ✅ Thông báo khi có bình luận mới
- ✅ Thông báo lời mời kết bạn
- ✅ Đánh dấu đã đọc
- ✅ Badge hiển thị số thông báo chưa đọc

### 6. Hồ sơ cá nhân
- ✅ Xem hồ sơ người dùng
- ✅ Chỉnh sửa thông tin cá nhân
- ✅ Danh sách bài viết của user
- ✅ Danh sách bạn bè
- ✅ Thống kê (followers, following, posts)

### 7. Tìm kiếm & Khám phá
- ✅ Tìm kiếm bài viết, người dùng, hashtag
- ✅ Debounced search
- ✅ Trending hashtags
- ✅ Trang hashtag

### 8. Quản trị viên
- ✅ Dashboard quản trị
- ✅ Xem báo cáo vi phạm
- ✅ Xóa bài viết vi phạm
- ✅ Thống kê hệ thống

### 9. Tính năng khác
- ✅ Infinite scroll cho bài viết
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 🏗️ Kiến trúc ứng dụng

### Component Architecture (31+ components)

#### Context Providers (5)
1. **AuthContext** - Quản lý authentication
2. **PostContext** - Quản lý bài viết
3. **NotificationContext** - Quản lý thông báo
4. **StoryContext** - Quản lý stories
5. **FriendContext** - Quản lý bạn bè

#### Custom Hooks (3)
6. **useImageUpload** - Upload và preview hình ảnh
7. **useInfiniteScroll** - Pagination với infinite scroll
8. **useDebounce** - Debounce cho search

#### Layout Components (4)
9. **Layout** - Main layout với sidebar
10. **Header** - Navigation bar
11. **Sidebar** - Desktop sidebar
12. **MobileNav** - Mobile bottom navigation

#### Post Components (3)
13. **PostCard** - Hiển thị bài viết
14. **CreatePostForm** - Form tạo bài viết
15. **CommentSection** - Bình luận

#### Story Components (3)
16. **StoryReel** - Danh sách stories
17. **StoryViewer** - Xem story
18. **CreateStoryDialog** - Tạo story

#### User/Friend Components (3)
19. **EditProfileDialog** - Chỉnh sửa profile
20. **TrendingHashtags** - Hashtag trending
21. **FriendSuggestions** - Gợi ý kết bạn

#### Pages (10)
22. **HomePage** - Trang chủ với feed
23. **LoginPage** - Đăng nhập
24. **RegisterPage** - Đăng ký
25. **ProfilePage** - Hồ sơ người dùng
26. **NotificationsPage** - Thông báo
27. **FriendsPage** - Quản lý bạn bè
28. **SearchPage** - Tìm kiếm
29. **HashtagPage** - Trang hashtag
30. **AdminPage** - Quản trị viên
31. **NotFoundPage** - 404

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form 7.55.0
- **State Management**: Context API
- **Date Formatting**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📁 Cấu trúc thư mục

```
/src/app/
├── components/          # React components
│   ├── ui/             # UI components (Radix UI)
│   ├── Layout.tsx
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── MobileNav.tsx
│   ├── PostCard.tsx
│   ├── CreatePostForm.tsx
│   ├── CommentSection.tsx
│   ├── StoryReel.tsx
│   ├── StoryViewer.tsx
│   ├── CreateStoryDialog.tsx
│   ├── EditProfileDialog.tsx
│   ├── TrendingHashtags.tsx
│   └── FriendSuggestions.tsx
├── contexts/           # Context providers
│   ├── AuthContext.tsx
│   ├── PostContext.tsx
│   ├── NotificationContext.tsx
│   ├── StoryContext.tsx
│   └── FriendContext.tsx
├── hooks/             # Custom hooks
│   ├── useImageUpload.ts
│   ├── useInfiniteScroll.ts
│   └── useDebounce.ts
├── pages/             # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProfilePage.tsx
│   ├── NotificationsPage.tsx
│   ├── FriendsPage.tsx
│   ├── SearchPage.tsx
│   ├── HashtagPage.tsx
│   ├── AdminPage.tsx
│   └── NotFoundPage.tsx
├── types/             # TypeScript types
│   └── index.ts
├── data/              # Mock data
│   └── mockData.ts
├── routes.ts          # Router configuration
└── App.tsx           # Root component
```

## 🔐 Demo Accounts

### User Accounts:
- Email: nguyenvana@example.com
- Email: tranthib@example.com
- Email: levanc@example.com
- Email: phamthid@example.com
- **Password**: Bất kỳ (frontend-only, không validate password)

### Admin Account:
- Email: admin@interacthub.com
- Password: Bất kỳ

## 🎨 Design Features

### Responsive Design
- **Mobile**: < 768px - Bottom navigation, single column
- **Tablet**: 768px - 1024px - Sidebar navigation
- **Desktop**: > 1024px - Full layout với 3 columns

### UI/UX Features
- Modern gradient design
- Smooth transitions và animations
- Loading states
- Toast notifications
- Infinite scroll
- Image preview
- Modal dialogs
- Dropdown menus

## 💾 Data Management

### Local Storage
Ứng dụng sử dụng localStorage để lưu trữ:
- Current user session
- Posts
- Stories
- Notifications
- Friend requests
- Reports

### State Management
- **Context API**: Global state cho user, posts, notifications, stories, friends
- **Local State**: Component-specific state với useState
- **Form State**: React Hook Form cho quản lý forms

## 🚀 Features Implementation

### Forms & Validation
- ✅ React Hook Form integration
- ✅ Field validation rules
- ✅ Error messages
- ✅ Submit handling

### Image Upload
- ✅ Multiple image selection
- ✅ Image preview
- ✅ Remove image
- ✅ Max 4 images per post
- ✅ Base64 encoding

### Routing
- ✅ React Router Data mode
- ✅ Protected routes (redirect to login)
- ✅ Dynamic routes (profile/:userId)
- ✅ 404 handling

### Search
- ✅ Debounced search input
- ✅ Search by content, username, hashtag
- ✅ Real-time results

### Infinite Scroll
- ✅ Load more posts on scroll
- ✅ Intersection Observer API
- ✅ Manual load more button

## 📱 Mobile Optimization

- Touch-friendly UI
- Bottom navigation
- Responsive images
- Mobile-first design
- Optimized layouts

## 🎯 Đáp ứng yêu cầu

✅ **15+ React components** - Đã tạo 31+ components
✅ **Responsive design** - Mobile friendly với breakpoints
✅ **Custom hooks** - 3 custom hooks
✅ **State management** - Context API cho user, post, notification, story, friend
✅ **Forms với React Hook Form** - Login, Register, EditProfile, CreatePost
✅ **Validation** - Form validation cho tất cả forms
✅ **Upload ảnh** - Image upload với preview
✅ **Routing** - React Router với protected routes
✅ **Pagination/Infinite scroll** - Infinite scroll cho posts
✅ **Search** - Debounced search với results

## 🔄 State Flow

1. **Authentication Flow**
   - User đăng nhập → AuthContext lưu user → Redirect to home

2. **Post Flow**
   - Create post → PostContext update → Display in feed

3. **Notification Flow**
   - User action → NotificationContext add notification → Show badge

4. **Friend Flow**
   - Send request → FriendContext update → Show in requests list

## 🎓 Kết luận

InteractHub là một ứng dụng mạng xã hội hoàn chỉnh với đầy đủ các tính năng được yêu cầu, sử dụng các công nghệ web hiện đại và best practices trong phát triển React application.
