import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { MessageSquare } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "sonner";
import { authService } from "../services/authService";

interface ResetPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Tách validate riêng cho Reset Password
 */
const resetPasswordValidation = {
  password: {
    required: "Mật khẩu là bắt buộc",

    minLength: {
      value: 6,
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    },

    maxLength: {
      value: 64,
      message: "Mật khẩu tối đa 64 ký tự",
    },

    pattern: {
      value:
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      message:
        "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
    },
  },

  confirmPassword: (password: string) => ({
    required: "Vui lòng xác nhận mật khẩu",
    validate: (value: string) =>
      value === password || "Mật khẩu không khớp",
  }),
};

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const emailParam = useMemo(
    () => searchParams.get("email") || "",
    [searchParams]
  );

  const tokenParam = useMemo(
    () => searchParams.get("token") || "",
    [searchParams]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: "onSubmit",
    defaultValues: {
      email: emailParam,
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!emailParam || !tokenParam) {
      toast.error("Thiếu thông tin đặt lại mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword(
        data.email.trim(),
        tokenParam,
        data.password
      );

      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const missingParams = !emailParam || !tokenParam;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">
            InteractHub
          </h1>

          <p className="text-blue-100">
            Đặt lại mật khẩu
          </p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Reset password</CardTitle>
            <CardDescription>
              Nhập mật khẩu mới để tiếp tục
            </CardDescription>
          </CardHeader>

          <CardContent>
            {missingParams ? (
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Liên kết đặt lại mật khẩu không hợp lệ
                  hoặc đã hết hạn.
                </p>

                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Yêu cầu liên kết mới
                </Link>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    disabled
                    value={emailParam}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mật khẩu mới
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                    {...register(
                      "password",
                      resetPasswordValidation.password
                    )}
                  />

                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Xác nhận mật khẩu
                  </Label>

                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                    {...register(
                      "confirmPassword",
                      resetPasswordValidation.confirmPassword(
                        password
                      )
                    )}
                  />

                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading
                    ? "Đang cập nhật..."
                    : "Đặt lại mật khẩu"}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-600">
              Quay lại{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;