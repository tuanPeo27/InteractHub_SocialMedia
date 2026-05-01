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

interface LoginForm {
  email: string;
  password: string;
}

/**
 * Validate riêng cho form login
 */
const loginValidation = {
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
  pattern: {
    // ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt
    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    message:
      "Mật khẩu phải có ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt",
  },
},
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);

    try {
      const result = await login(data.email.trim(), data.password);

      if (result.success) {
        toast.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        toast.error(result.message || "Email hoặc mật khẩu không đúng!");
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

          <h1 className="text-4xl font-bold text-white mb-2">InteractHub</h1>

          <p className="text-blue-100">
            Kết nối mọi người, chia sẻ khoảnh khắc
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Đăng nhập để tiếp tục sử dụng InteractHub
            </CardDescription>
          </CardHeader>

          <CardContent>
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
                  placeholder="example@email.com"
                  disabled={loading}
                  autoComplete="email"
                  {...register("email", loginValidation.email)}
                />

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                </div>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  {...register("password", loginValidation.password)}
                />

                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              
              {/* Link quên mật khẩu */}
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
