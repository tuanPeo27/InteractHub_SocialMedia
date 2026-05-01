import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { authService } from "../services/authService";

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Tách validate riêng cho Change Password
 */
const changePasswordValidation = {
  currentPassword: {
    required: "Mật khẩu hiện tại là bắt buộc",

    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },
  },

  newPassword: {
    required: "Mật khẩu mới là bắt buộc",

    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },

    maxLength: {
      value: 64,
      message: "Mật khẩu tối đa 64 ký tự",
    },

    pattern: {
      // ít nhất 1 chữ hoa + 1 số + 1 ký tự đặc biệt
      value:
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      message:
        "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
    },
  },

  confirmPassword: (newPassword: string) => ({
    required: "Vui lòng xác nhận mật khẩu",
    validate: (value: string) =>
      value === newPassword || "Mật khẩu không khớp",
  }),
};

const ChangePasswordDialog: React.FC<
  ChangePasswordDialogProps
> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    mode: "onSubmit",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);

    try {
      await authService.changePassword(
        data.currentPassword,
        data.newPassword
      );

      toast.success("Đổi mật khẩu thành công!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) =>
        !nextOpen && onClose()
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>

          <DialogDescription>
            Cập nhật mật khẩu mới cho tài khoản của bạn.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Mật khẩu hiện tại
            </Label>

            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              disabled={loading}
              {...register(
                "currentPassword",
                changePasswordValidation.currentPassword
              )}
            />

            {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">
              Mật khẩu mới
            </Label>

            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              disabled={loading}
              {...register(
                "newPassword",
                changePasswordValidation.newPassword
              )}
            />

            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Xác nhận mật khẩu mới
            </Label>

            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              disabled={loading}
              {...register(
                "confirmPassword",
                changePasswordValidation.confirmPassword(
                  newPassword
                )
              )}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Đang lưu..."
                : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;