import React from 'react';
import { Link } from 'react-router';
import { Users, UserPlus, UserMinus, Check, X } from 'lucide-react';
import { useFriends } from '../contexts/FriendContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import FriendList from '../components/FriendList';

const FriendsPage: React.FC = () => {
  const { friends, friendRequests, getPendingRequests, acceptFriendRequest, rejectFriendRequest, removeFriend } = useFriends();
  const pendingRequests = getPendingRequests();

  const handleAccept = (requestId: string) => {
    acceptFriendRequest(requestId);
    toast.success('Đã chấp nhận lời mời kết bạn!');
  };

  const handleReject = (requestId: string) => {
    rejectFriendRequest(requestId);
    toast.success('Đã từ chối lời mời kết bạn!');
  };

  const handleRemoveFriend = (userId: string) => {
    removeFriend(userId);
    toast.success('Đã hủy kết bạn!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bạn bè
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="friends">
            <TabsList className="w-full">
              <TabsTrigger value="friends" className="flex-1">
                Danh sách bạn bè
                <Badge variant="secondary" className="ml-2">{friends.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">
                Lời mời
                {pendingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="mt-6">
              <FriendList
                friends={friends}
                onRemoveFriend={handleRemoveFriend}
                emptyMessage="Chưa có bạn bè"
              />
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <div className="space-y-3">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                      <Link to={`/profile/${request.fromUser.id}`}>
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={request.fromUser.avatar} alt={request.fromUser.fullName} />
                          <AvatarFallback>{request.fromUser.fullName[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/profile/${request.fromUser.id}`} className="font-medium hover:underline block">
                          {request.fromUser.fullName}
                        </Link>
                        <p className="text-sm text-gray-500">@{request.fromUser.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Chấp nhận
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Từ chối
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Không có lời mời kết bạn nào</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsPage;
