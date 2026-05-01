import React, { useState } from 'react';
import { Link } from 'react-router';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import CommentSection from './CommentSection';
import { toast } from 'sonner';
import { cn } from './ui/utils';

interface PostCardProps {
  post: Post;
  onReport?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onReport }) => {
  const { user } = useAuth();
  const { likePost, unlikePost, sharePost, deletePost } = usePosts();
  const [showComments, setShowComments] = useState(false);

  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwnPost = user?.id === post.userId;
  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };

  const handleShare = () => {
    sharePost(post.id);
    toast.success('Đã chia sẻ bài viết!');
  };

  const handleDelete = () => {
    deletePost(post.id);
    toast.success('Đã xóa bài viết!');
  };

  const handleReport = () => {
    if (onReport) {
      onReport(post.id);
    } else {
      // Save report to localStorage
      const reports = JSON.parse(localStorage.getItem('reports') || '[]');
      const newReport = {
        id: `r${Date.now()}`,
        postId: post.id,
        post: post,
        reportedBy: user,
        reason: 'Nội dung không phù hợp',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      reports.push(newReport);
      localStorage.setItem('reports', JSON.stringify(reports));
    }
    toast.success('Đã báo cáo bài viết!');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link to={`/profile/${post.user.id}`} className="flex items-center gap-3 hover:opacity-80">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.fullName} />
              <AvatarFallback>{post.user.fullName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.user.fullName}</p>
              <p className="text-sm text-gray-500">
                @{post.user.username} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
              </p>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost ? (
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa bài viết
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="w-4 h-4 mr-2" />
                  Báo cáo
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {/* Content */}
        <p className="whitespace-pre-wrap">
          {post.content.split(' ').map((word, index) => {
            if (word.startsWith('#')) {
              return (
                <Link
                  key={index}
                  to={`/hashtag/${word.slice(1)}`}
                  className="text-blue-600 hover:underline"
                >
                  {word}{' '}
                </Link>
              );
            }
            return word + ' ';
          })}
        </p>

        {/* Images */}
        {post.images.length > 0 && (
          <div className={cn(
            "grid gap-2 rounded-lg overflow-hidden",
            post.images.length === 1 ? "grid-cols-1" :
              post.images.length === 2 ? "grid-cols-2" :
                post.images.length === 3 ? "grid-cols-2" :
                  "grid-cols-2"
          )}>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover",
                  post.images.length === 3 && index === 0 ? "row-span-2" : "aspect-square"
                )}
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-3 border-t">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 w-full">
          <span>{post.likes.length} lượt thích</span>
          <span>{post.comments.length} bình luận</span>
          <span>{post.shares} chia sẻ</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(isLiked && 'text-red-500')}
          >
            <Heart className={cn("w-5 h-5 mr-2", isLiked && 'fill-current')} />
            Thích
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Bình luận
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-5 h-5 mr-2" />
            Chia sẻ
          </Button>
        </div>

        {/* Comments */}
        {showComments && <CommentSection post={post} />}
      </CardFooter>
    </Card>
  );
};

export default PostCard;