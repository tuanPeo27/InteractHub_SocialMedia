import React from 'react';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bell, Heart, MessageCircle, UserPlus, Share2, Trash2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'friend_request':
      case 'friend_accept':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'share':
        return <Share2 className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Thông báo
          </CardTitle>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.read) && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Đánh dấu đã đọc tất cả
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  const deletedCount = await deleteAllNotifications();
                  toast.success(`Đã xóa ${deletedCount} thông báo`);
                }}
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-gray-50 transition-colors cursor-pointer",
                    !notification.read && "bg-blue-50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <Link to={`/profile/${notification.fromUser.id}`}>
                      <Avatar>
                        <AvatarImage src={notification.fromUser.avatar} alt={notification.fromUser.fullName} />
                        <AvatarFallback>{notification.fromUser.fullName[0]}</AvatarFallback>
                      </Avatar>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <p className="text-sm">
                            <Link to={`/profile/${notification.fromUser.id}`} className="font-medium hover:underline">
                              {notification.fromUser.fullName}
                            </Link>
                            {' '}
                            <span className="text-gray-600">{notification.message}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: vi })}
                          </p>
                        </div>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="mt-2 flex items-center gap-3">
                        {notification.url && (
                          <Link
                            to={notification.url}
                            className="text-xs text-blue-600 hover:underline inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Mở
                          </Link>
                        )}
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:underline"
                          onClick={(event) => {
                            event.stopPropagation();
                            void deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Xóa
                        </button>
                      </div>
                    </div>

                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có thông báo nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
