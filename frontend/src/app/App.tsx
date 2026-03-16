import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { PostProvider } from './contexts/PostContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { StoryProvider } from './contexts/StoryContext';
import { FriendProvider } from './contexts/FriendContext';
import { router } from './routes';

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <NotificationProvider>
          <StoryProvider>
            <FriendProvider>
              <RouterProvider router={router} />
            </FriendProvider>
          </StoryProvider>
        </NotificationProvider>
      </PostProvider>
    </AuthProvider>
  );
}