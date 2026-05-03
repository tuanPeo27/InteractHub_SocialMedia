import React, { useState } from 'react';
import { Image as ImageIcon, X, Hash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { useImageUpload } from '../hooks/useImageUpload';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { toast } from 'sonner';

const CreatePostForm: React.FC = () => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const { images, previews, uploading, handleFileChange, removeImage, clearImages } = useImageUpload(4);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<number>(0);

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && images.length === 0) {
      toast.error('Vui lòng nhập nội dung hoặc thêm hình ảnh!');
      return;
    }

    const hashtags = extractHashtags(content);
    createPost(content, images, hashtags, visibility);

    setContent('');
    setVisibility(0);
    clearImages();
    toast.success('Đã đăng bài viết!');
  };

  if (!user) return null;

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[100px] resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700" htmlFor="visibility">
            Quyền riêng tư
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(Number(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value={0}>Công khai</option>
            <option value={1}>Bạn bè</option>
            <option value={2}>Chỉ mình tôi</option>
          </select>
        </div>

        {/* Image Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <label htmlFor="image-upload">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading || images.length >= 4}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Hình ảnh
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Hash className="w-4 h-4" />
              <span>Sử dụng #hashtag</span>
            </div>
          </div>

          <Button type="submit" disabled={uploading}>
            {uploading ? 'Đang tải...' : 'Đăng'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreatePostForm;
