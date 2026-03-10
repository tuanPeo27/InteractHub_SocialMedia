import React, { useState } from 'react';
import { Link } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Send } from 'lucide-react';
import { Post } from '../types';
import { usePosts } from '../contexts/PostContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface CommentSectionProps {
  post: Post;
}

const CommentSection: React.FC<CommentSectionProps> = ({ post }) => {
  const { addComment } = usePosts();
  const [commentText, setCommentText] = useState('');

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
          <div key={comment.id} className="flex gap-2">
            <Link to={`/profile/${comment.user.id}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.user.avatar} alt={comment.user.fullName} />
                <AvatarFallback>{comment.user.fullName[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <Link to={`/profile/${comment.user.id}`} className="font-medium text-sm hover:underline">
                  {comment.user.fullName}
                </Link>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 ml-3">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
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
