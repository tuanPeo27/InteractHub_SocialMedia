import React from 'react';
import { Link } from 'react-router';
import { User } from '../types';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface FriendListProps {
  friends: User[];
  onRemoveFriend?: (userId: string) => void;
  emptyMessage?: string;
  showRemoveButton?: boolean;
}

const FriendList: React.FC<FriendListProps> = ({
  friends,
  onRemoveFriend,
  emptyMessage = 'Chưa có bạn bè',
  showRemoveButton = true,
}) => {
  if (friends.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {friends.map((friend) => (
        <Card key={friend.id}>
          <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6">
            <Link to={`/profile/${friend.id}`} className="mx-auto sm:mx-0">
              <Avatar className="w-16 h-16">
                <AvatarImage src={friend.avatar} alt={friend.fullName} />
                <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 text-center sm:text-left">
              <Link
                to={`/profile/${friend.id}`}
                className="font-medium hover:underline block"
              >
                {friend.fullName}
              </Link>
              <p className="text-sm text-gray-500">@{friend.username}</p>
            </div>

            {showRemoveButton && onRemoveFriend && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveFriend(friend.id)}
                className="w-full sm:w-auto cursor-pointer"
              >
                Hủy kết bạn
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FriendList;