import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../contexts/UsersContext';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { toast } from 'sonner';

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ProfileForm {
  fullName: string;
  username: string;
  bio: string;
  avatar: string;
  phoneNumber: string;
  dateOfBirth: string;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  open,
  onClose,
}) => {
  const { user, updateProfile } = useAuth();
  const { refreshUsers } = useUsers();

  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');

  const { register, handleSubmit, setValue } = useForm<ProfileForm>({
    defaultValues: {
      fullName: user?.fullName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth?.split('T')[0] || '',
    },
  });

  const handleAvatarUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;

      setPreviewAvatar(base64);
      setValue('avatar', base64);
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data);
      await refreshUsers();

      toast.success('Đã cập nhật hồ sơ!');
      onClose();
    } catch {
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={previewAvatar} />
              <AvatarFallback>
                {user?.fullName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            <div>
              <Label htmlFor="avatar-upload" className="my-2">Ảnh đại diện</Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="mt-2 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <Label className="my-2">Họ và tên</Label>
            <Input {...register('fullName', { required: true })} />
          </div>

          <div>
            <Label className="my-2">Username</Label>
            <Input {...register('username', { required: true })} />
          </div>

          <div>
            <Label className="my-2">Bio</Label>
            <Textarea rows={3} {...register('bio')} />
          </div>

          <div>
            <Label className="my-2">Số điện thoại</Label>
            <Input {...register('phoneNumber')} />
          </div>

          <div>
            <Label className="my-2">Ngày sinh</Label>
            <Input type="date" {...register('dateOfBirth')} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2 cursor-pointer">
              Hủy
            </Button>
            <Button type="submit" className="cursor-pointer">Lưu thay đổi</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;