import React from 'react';
import { Link } from 'react-router';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFriends } from '../contexts/FriendContext';
import { useUsers } from '../contexts/UsersContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

const FriendSuggestions: React.FC = () => {
  const { user } = useAuth();
  const { friends, sendFriendRequest, hasPendingRequest } = useFriends();
  const { users } = useUsers();

  const suggestions = users
    .filter(u => u.id !== user?.id && !friends.some(f => f.id === u.id))
    .slice(0, 5);

  const handleSendRequest = async (userId: string) => {
    await sendFriendRequest(userId);
    toast.success('Đã gửi lời mời kết bạn!');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Gợi ý kết bạn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestedUser) => (
          <div key={suggestedUser.id} className="flex items-center gap-3">
            <Link to={`/profile/${suggestedUser.id}`}>
              <Avatar>
                <AvatarImage src={suggestedUser.avatar} alt={suggestedUser.fullName} />
                <AvatarFallback>{suggestedUser.fullName[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${suggestedUser.id}`} className="font-medium hover:underline block truncate">
                {suggestedUser.fullName}
              </Link>
              <p className="text-sm text-gray-500 truncate">@{suggestedUser.username}</p>
            </div>
            <Button
              size="sm"
              variant={hasPendingRequest(suggestedUser.id) ? 'outline' : 'default'}
              onClick={() => handleSendRequest(suggestedUser.id)}
              disabled={hasPendingRequest(suggestedUser.id)}
            >
              {hasPendingRequest(suggestedUser.id) ? 'Đã gửi' : 'Kết bạn'}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FriendSuggestions;
