import React, { useState } from 'react';
import { useParams, Link } from 'react-router';
import { UserPlus, UserMinus, Settings, MapPin, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { useFriends } from '../contexts/FriendContext';
import { useUsers } from '../contexts/UsersContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PostCard from '../components/PostCard';
import EditProfileDialog from '../components/EditProfileDialog';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { posts } = usePosts();
  const { friends, isFriend, sendFriendRequest, removeFriend, hasPendingRequest } = useFriends();
  const { users } = useUsers();
  const [showEditProfile, setShowEditProfile] = useState(false);

  // If no userId, show current user's profile
  const profileUserId = userId || currentUser?.id;
  const profileUser = users.find(u => u.id === profileUserId) || currentUser;
  const isOwnProfile = currentUser?.id === profileUserId;

  const userPosts = posts.filter(p => p.userId === profileUserId);
  const userFriends = isOwnProfile ? friends : [];

  const handleFriendAction = async () => {
    if (!profileUser) return;

    if (isFriend(profileUser.id)) {
      removeFriend(profileUser.id);
      toast.success('Đã hủy kết bạn!');
    } else if (hasPendingRequest(profileUser.id)) {
      toast.info('Đã gửi lời mời kết bạn trước đó!');
    } else {
      await sendFriendRequest(profileUser.id);
      toast.success('Đã gửi lời mời kết bạn!');
    }
  };

  if (!profileUser) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy người dùng</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="w-32 h-32 mx-auto md:mx-0">
              <AvatarImage src={profileUser.avatar} alt={profileUser.fullName} />
              <AvatarFallback className="text-3xl">{profileUser.fullName[0]}</AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{profileUser.fullName}</h1>
                  <p className="text-gray-600">@{profileUser.username}</p>
                </div>

                {isOwnProfile ? (
                  <Button onClick={() => setShowEditProfile(true)} className="md:ml-auto">
                    <Settings className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <Button
                    onClick={handleFriendAction}
                    variant={isFriend(profileUser.id) ? 'outline' : 'default'}
                    className="md:ml-auto"
                  >
                    {isFriend(profileUser.id) ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Hủy kết bạn
                      </>
                    ) : hasPendingRequest(profileUser.id) ? (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Đã gửi lời mời
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Kết bạn
                      </>
                    )}
                  </Button>
                )}
              </div>

              <p className="text-gray-700 mb-4">{profileUser.bio || 'Chưa có giới thiệu'}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Tham gia {formatDistanceToNow(new Date(profileUser.createdAt), { addSuffix: true, locale: vi })}
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <div>
                  <span className="font-bold">{userPosts.length}</span>
                  <span className="text-gray-600 ml-1">Bài viết</span>
                </div>
                {/* <div>
                  <span className="font-bold">{profileUser.followers}</span>
                  <span className="text-gray-600 ml-1">Người theo dõi</span>
                </div>
                <div>
                  <span className="font-bold">{profileUser.following}</span>
                  <span className="text-gray-600 ml-1">Đang theo dõi</span>
                </div> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">Bài viết</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="friends" className="flex-1">Bạn bè</TabsTrigger>}
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {userPosts.length > 0 ? (
            userPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Chưa có bài viết nào</p>
            </div>
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="friends" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userFriends.map(friend => (
                <Card key={friend.id}>
                  <CardContent className="flex items-center gap-3 pt-6">
                    <Link to={`/profile/${friend.id}`}>
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={friend.avatar} alt={friend.fullName} />
                        <AvatarFallback>{friend.fullName[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${friend.id}`} className="font-medium hover:underline">
                        {friend.fullName}
                      </Link>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeFriend(friend.id)}>
                      Hủy kết bạn
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {userFriends.length === 0 && (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <p>Chưa có bạn bè</p>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <EditProfileDialog open={showEditProfile} onClose={() => setShowEditProfile(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
