import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Send } from 'lucide-react';
import { Post } from '../types';
import { usePosts } from '../contexts/PostContext';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getVietnamTime } from '../utils/dateHelper';

interface CommentSectionProps {
  post: Post;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post }) => {
  const { user } = useAuth();
  const { addComment, deleteComment } = usePosts();
  const [commentText, setCommentText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(post.id, commentId);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Lỗi khi xóa bình luận:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setDeleteConfirm(null);
      }
    };

    if (deleteConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [deleteConfirm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className="w-full space-y-4 pt-3 border-t">
      {/* Comment List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {post.comments.map((comment) => (
          <div key={comment.id} className="flex gap-2 group">
            <Link to={`/profile/${comment.user.id}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user.avatar} alt={comment.user.fullName} />
                <AvatarFallback>{comment.user.fullName[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2 relative">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Link to={`/profile/${comment.user.id}`} className="font-medium text-sm hover:underline">
                      {comment.user.fullName}
                    </Link>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                  {user?.id === comment.user.id && (
                    <div className="relative ml-2">
                      <button
                        onClick={() => setDeleteConfirm(comment.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors font-bold text-lg"
                        title="Tùy chọn"
                      >
                        ...
                      </button>
                      {deleteConfirm === comment.id && (
                        <div
                          ref={popupRef}
                          className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-0 z-10 min-w-max"
                        >
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-t-lg transition-colors"
                          >
                            Xóa bình luận
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-b-lg transition-colors border-t border-gray-200"
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-3">
                {formatDistanceToNow(getVietnamTime(comment.createdAt), { addSuffix: true, locale: vi })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Viết bình luận..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!commentText.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default CommentSection;
