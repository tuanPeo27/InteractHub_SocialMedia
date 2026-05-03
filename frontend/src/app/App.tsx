import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { UsersProvider } from './contexts/UsersContext';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { StoryProvider } from './contexts/StoryContext';
import { FriendProvider } from './contexts/FriendContext';
import { router } from './routes';

export default function App() {
  return (
    <UsersProvider>
      <AuthProvider>
        <PostProvider>
          <NotificationProvider>
            <StoryProvider>
              <FriendProvider>
                <RouterProvider router={router} />
                <Toaster />
              </FriendProvider>
            </StoryProvider>
          </NotificationProvider>
        </PostProvider>
      </AuthProvider>
    </UsersProvider>
  );
}