import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Flag, Lock, Globe2, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import CommentSection from './CommentSection';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { likesService } from '../services/likesService';
import { getVietnamTime } from '../utils/dateHelper';

interface PostCardProps {
  post: Post;
  onReport?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onReport }) => {
  const { user } = useAuth();
  const { likePost, unlikePost, deletePost } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [likeUsers, setLikeUsers] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isOwnPost = user?.id === post.userId;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);
  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
  };


  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      toast.success('Đã xóa bài viết!');
    } catch {
      toast.error('Xóa bài viết thất bại!');
    }
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

  const handleOpenLikes = async () => {
    try {
      const data = await likesService.getLikeDetail(post.id);

      setLikeUsers(data.users);
      setShowLikes(true);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <>
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
                <p className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                  @{post.user.username} · {formatDistanceToNow(getVietnamTime(post.createdAt), { addSuffix: true, locale: vi })}
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {post.visibility === 1 ? <Users className="w-3.5 h-3.5" /> : post.visibility === 2 ? <Lock className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
                    {post.visibility === 1 ? 'Bạn bè' : post.visibility === 2 ? 'Chỉ mình tôi' : 'Công khai'}

                  </span>
                </p>
              </div>
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-0 z-10 min-w-max">
                  {isOwnPost ? (
                    <>
                      <button
                        onClick={() => {
                          void handleDelete();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-t-lg transition-colors flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa bài viết
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          handleReport();
                          setShowMenu(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Báo cáo
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
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
            <button
              onClick={handleOpenLikes}
              className="font-medium hover:underline transition-all inline-flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              {post.likes.length} lượt thích
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="font-medium hover:underline transition-all inline-flex items-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments.length} bình luận
            </button>
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


          </div>

          {/* Comments */}
          {showComments && <CommentSection post={post} />}
        </CardFooter>
      </Card>

      {showLikes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <h2 className="font-bold">Lượt thích</h2>
              <button onClick={() => setShowLikes(false)} className="cursor-pointer hover:opacity-70">
                ✕
              </button>
            </div>

            {likeUsers.length > 0 ? (
              likeUsers.map((u) => (
                <Link
                  key={u.userId}
                  to={`/profile/${u.userId}`}
                  className="flex items-center gap-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  onClick={() => setShowLikes(false)}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={u.avatar || undefined} alt={u.userName} />
                    <AvatarFallback>
                      {u.userName?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{u.userName}</p>
                    <p className="text-xs text-gray-500">
                      Đã thích bài viết
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Không có lượt thích</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;