import React from 'react';
import { UserPlus, Check, Clock } from 'lucide-react';

import { User } from '../types';
import { useFriends } from '../contexts/FriendContext';

interface Props {
  user: User;
}

const UserCard: React.FC<Props> = ({ user }) => {
  const {
    sendFriendRequest,
    isFriend,
    hasPendingRequest,
  } = useFriends();

  const friend = isFriend(user.id);
  const pending = hasPendingRequest(user.id);

  return (
    <div className="border rounded-xl p-4 flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{user.fullName}</h3>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>

      {friend ? (
        <button
          disabled
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2"
        >
          <Check size={16} />
          Bạn bè
        </button>
      ) : pending ? (
        <button
          disabled
          className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg flex items-center gap-2"
        >
          <Clock size={16} />
          Đang chờ
        </button>
      ) : (
        <button
          onClick={() => sendFriendRequest(user.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <UserPlus size={16} />
          Kết bạn
        </button>
      )}
    </div>
  );
};

export default UserCard;