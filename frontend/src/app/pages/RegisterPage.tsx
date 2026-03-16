import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();
  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const success = await registerUser({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: data.password,
      });

      if (success) {
        toast.success('Đăng ký thành công!');
        navigate('/');
      } else {
        toast.error('Đăng ký thất bại!');
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra!');
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
          <p className="text-blue-100">Tạo tài khoản để bắt đầu</p>
        </div>

        {/* Register Form */}
        <Card>
          <CardHeader>
            <CardTitle>Đăng ký</CardTitle>
            <CardDescription>Tạo tài khoản mới của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  {...register('fullName', { required: 'Họ và tên là bắt buộc' })}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Tên người dùng</Label>
                <Input
                  id="username"
                  placeholder="nguyenvana"
                  {...register('username', {
                    required: 'Tên người dùng là bắt buộc',
                    pattern: {
                      value: /^[a-z0-9_]+$/,
                      message: 'Chỉ được dùng chữ thường, số và dấu gạch dưới'
                    }
                  })}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register('email', {
                    required: 'Email là bắt buộc',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: value => value === password || 'Mật khẩu không khớp'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
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
