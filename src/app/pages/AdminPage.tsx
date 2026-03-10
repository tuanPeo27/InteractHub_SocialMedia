import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Flag, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';
import { Report } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import PostCard from '../components/PostCard';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { posts, deletePost } = usePosts();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      navigate('/');
      toast.error('Bạn không có quyền truy cập trang này!');
    }

    // Load reports from localStorage
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, [user, navigate]);

  const handleRemovePost = (postId: string, reportId?: string) => {
    deletePost(postId);
    
    if (reportId) {
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, status: 'removed' as const } : r
      ));
      localStorage.setItem('reports', JSON.stringify(reports));
    }
    
    toast.success('Đã xóa bài viết!');
  };

  const handleMarkReviewed = (reportId: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: 'reviewed' as const } : r
    ));
    localStorage.setItem('reports', JSON.stringify(reports));
    toast.success('Đã đánh dấu đã xem xét!');
  };

  if (!user?.isAdmin) {
    return null;
  }

  const pendingReports = reports.filter(r => r.status === 'pending');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Bảng điều khiển quản trị viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Báo cáo chờ xử lý</p>
              <p className="text-2xl font-bold">{pendingReports.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Đã xem xét</p>
              <p className="text-2xl font-bold">
                {reports.filter(r => r.status === 'reviewed').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reported Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5" />
            Nội dung được báo cáo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => {
                const post = posts.find(p => p.id === report.postId);
                if (!post) return null;

                return (
                  <div key={report.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant={
                          report.status === 'pending' ? 'destructive' :
                          report.status === 'reviewed' ? 'secondary' : 'default'
                        }>
                          {report.status === 'pending' ? 'Chờ xử lý' :
                           report.status === 'reviewed' ? 'Đã xem xét' : 'Đã xóa'}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Lý do: {report.reason}
                        </p>
                        <p className="text-xs text-gray-400">
                          Báo cáo bởi: {report.reportedBy.fullName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {report.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkReviewed(report.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Đã xem
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemovePost(report.postId, report.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      <PostCard post={post} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Flag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Không có báo cáo nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Posts Management */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý tất cả bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="border rounded-lg p-4">
                <PostCard post={post} />
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePost(post.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa bài viết
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
