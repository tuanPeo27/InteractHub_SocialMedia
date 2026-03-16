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

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        toast.error('Email hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email: string) => {
    setValue('email', email);
    setValue('password', 'demo123');
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
          <p className="text-blue-100">Kết nối mọi người, chia sẻ khoảnh khắc</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>Đăng nhập để tiếp tục sử dụng InteractHub</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register('email', { required: 'Email là bắt buộc' })}
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
                  {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Tài khoản demo:</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('nguyenvana@example.com')}
                  className="w-full text-left px-3 py-2 bg-white rounded-md hover:bg-blue-100 transition-colors text-sm"
                >
                  <span className="font-medium">Nguyễn Văn A</span>
                  <br />
                  <span className="text-xs text-gray-600">nguyenvana@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('tranthib@example.com')}
                  className="w-full text-left px-3 py-2 bg-white rounded-md hover:bg-blue-100 transition-colors text-sm"
                >
                  <span className="font-medium">Trần Thị B</span>
                  <br />
                  <span className="text-xs text-gray-600">tranthib@example.com</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin@interacthub.com')}
                  className="w-full text-left px-3 py-2 bg-white rounded-md hover:bg-blue-100 transition-colors text-sm"
                >
                  <span className="font-medium">Admin</span>
                  <br />
                  <span className="text-xs text-gray-600">admin@interacthub.com</span>
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
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