import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import HashtagPage from './pages/HashtagPage';
import SearchPage from './pages/SearchPage';
import FriendsPage from './pages/FriendsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: 'profile/:userId?', Component: ProfilePage },
      { path: 'hashtag/:tag', Component: HashtagPage },
      { path: 'search', Component: SearchPage },
      { path: 'friends', Component: FriendsPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'admin', Component: AdminPage },
    ],
  },
  { path: '/login', Component: LoginPage },
  { path: '/register', Component: RegisterPage },
  { path: '/forgot-password', Component: ForgotPasswordPage },
  { path: '/reset-password', Component: ResetPasswordPage },
  { path: '*', Component: NotFoundPage },
]);
