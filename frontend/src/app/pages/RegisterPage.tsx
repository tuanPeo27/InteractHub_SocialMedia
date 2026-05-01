import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { MessageSquare } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
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

interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerValidation = {
  fullName: {
    required: "Họ và tên là bắt buộc",
    minLength: {
      value: 2,
      message: "Họ và tên phải có ít nhất 2 ký tự",
    },
    setValueAs: (value: string) => value?.trim(),
  },

  username: {
    required: "Tên người dùng là bắt buộc",
    pattern: {
      value: /^[a-z0-9_]+$/,
      message: "Chỉ được dùng chữ thường, số và dấu gạch dưới",
    },
    minLength: {
      value: 3,
      message: "Tên người dùng phải có ít nhất 3 ký tự",
    },
    maxLength: {
      value: 20,
      message: "Tên người dùng tối đa 20 ký tự",
    },
    setValueAs: (value: string) => value?.trim(),
  },

  email: {
    required: "Email là bắt buộc",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Email không hợp lệ",
    },
    setValueAs: (value: string) => value?.trim(),
  },

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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);

    try {
      const result = await registerUser({
        fullName: data.fullName,
        username: data.username,
        email: data.email.trim(),
        password: data.password,
      });

      if (result.success) {
        toast.success("Đăng ký thành công!");
        navigate("/");
      } else {
        toast.error(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

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
            Tạo tài khoản để bắt đầu
          </p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Đăng ký</CardTitle>
            <CardDescription>
              Tạo tài khoản mới của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>

                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  disabled={loading}
                  {...register(
                    "fullName",
                    registerValidation.fullName
                  )}
                />

                {errors.fullName && (
                  <p className="text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">
                  Tên người dùng
                </Label>

                <Input
                  id="username"
                  placeholder="nguyenvana"
                  disabled={loading}
                  {...register(
                    "username",
                    registerValidation.username
                  )}
                />

                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  disabled={loading}
                  {...register(
                    "email",
                    registerValidation.email
                  )}
                />

                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={loading}
                  {...register(
                    "password",
                    registerValidation.password
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
                  disabled={loading}
                  {...register(
                    "confirmPassword",
                    registerValidation.confirmPassword(password)
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
                  ? "Đang đăng ký..."
                  : "Đăng ký"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
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

export default RegisterPage;