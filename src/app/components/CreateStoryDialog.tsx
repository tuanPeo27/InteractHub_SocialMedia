import React from 'react';
import { Upload } from 'lucide-react';
import { useStories } from '../contexts/StoryContext';
import { useImageUpload } from '../hooks/useImageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface CreateStoryDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateStoryDialog: React.FC<CreateStoryDialogProps> = ({ open, onClose }) => {
  const { createStory } = useStories();
  const { images, previews, uploading, handleFileChange, clearImages } = useImageUpload(1);

  const handleSubmit = () => {
    if (images.length === 0) {
      toast.error('Vui lòng chọn hình ảnh!');
      return;
    }

    createStory(images[0]);
    clearImages();
    onClose();
    toast.success('Đã tạo story!');
  };

  const handleClose = () => {
    clearImages();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo Story mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {previews.length > 0 ? (
            <div className="relative aspect-[9/16] max-h-96 rounded-lg overflow-hidden bg-gray-100">
              <img src={previews[0]} alt="Story preview" className="w-full h-full object-cover" />
            </div>
          ) : (
            <label htmlFor="story-upload" className="block">
              <div className="aspect-[9/16] max-h-96 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Nhấp để tải hình ảnh lên</p>
                <p className="text-xs text-gray-400 mt-1">Story sẽ tự động xóa sau 24 giờ</p>
              </div>
              <input
                id="story-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={uploading || images.length === 0}>
              {uploading ? 'Đang tải...' : 'Đăng Story'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryDialog;
