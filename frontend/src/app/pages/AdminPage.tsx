import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Shield, Flag, Trash2, Eye, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { usePosts } from "../contexts/PostContext";
import { Post } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import PostCard from "../components/PostCard";
import { toast } from "sonner";
import { adminService } from "../services/adminService";
import type { ApiAdminUser, ApiReport } from "../services/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { DEFAULT_AVATAR } from "../services/mappers";

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { posts } = usePosts();
  const navigate = useNavigate();
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [users, setUsers] = useState<ApiAdminUser[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [removedPostIds, setRemovedPostIds] = useState<Set<string>>(() => new Set());
  const [reviewedReports, setReviewedReports] = useState<Set<number>>(
    () => new Set(),
  );
  const [selectedUser, setSelectedUser] = useState<ApiAdminUser | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      navigate("/");
      toast.error("Bạn không có quyền truy cập trang này!");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadReports = async () => {
      if (!user?.isAdmin) return;
      setLoadingReports(true);
      try {
        const data = await adminService.getReports();
        setReports(data);
      } catch {
        setReports([]);
      } finally {
        setLoadingReports(false);
      }
    };

    void loadReports();
  }, [user?.isAdmin]);

  useEffect(() => {
    const loadUsers = async () => {
      if (!user?.isAdmin) return;
      setLoadingUsers(true);
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch {
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    void loadUsers();
  }, [user?.isAdmin]);

  const handleRemovePost = async (postId: number) => {
    try {
      await adminService.deletePost(String(postId));

      setRemovedPostIds((current) => {
        const next = new Set(current);
        next.add(String(postId));
        return next;
      });

      setReports((current) =>
        current.filter((report) => String(report.postId) !== String(postId)),
      );

      toast.success("Đã xóa bài viết!");
    } catch {
      toast.error("Xóa bài viết thất bại!");
    }
  };

  const handleMarkReviewed = (reportId: number) => {
    setReviewedReports((current) => {
      const next = new Set(current);
      next.add(reportId);
      return next;
    });
    toast.success("Đã đánh dấu đã xem xét!");
  };

  const handleBanUser = async (userId: string) => {
    try {
      await adminService.banUser(userId);
      setUsers((current) =>
        current.map((item) =>
          item.id === userId ? { ...item, isLocked: true } : item,
        ),
      );
      toast.success("Đã khóa người dùng!");
    } catch {
      toast.error("Khóa người dùng thất bại!");
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      await adminService.unbanUser(userId);
      setUsers((current) =>
        current.map((item) =>
          item.id === userId ? { ...item, isLocked: false } : item,
        ),
      );
      toast.success("Đã mở khóa người dùng!");
    } catch {
      toast.error("Mở khóa thất bại!");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers((current) => current.filter((item) => item.id !== userId));
      toast.success("Đã xóa người dùng!");
    } catch {
      toast.error("Xóa người dùng thất bại!");
    }
  };

  const handleRoleChange = async (userId: string, roleName: string) => {
    try {
      await adminService.setUserRole(userId, roleName);
      setUsers((current) =>
        current.map((item) =>
          item.id === userId ? { ...item, roles: [roleName] } : item,
        ),
      );
      toast.success("Cập nhật role thành công!");
    } catch {
      toast.error("Cập nhật role thất bại!");
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("vi-VN");
  };

  if (!user?.isAdmin) {
    return null;
  }

  const reportStats = useMemo(() => {
    const reviewed = reports.filter((report) =>
      reviewedReports.has(report.id),
    ).length;
    return {
      total: reports.length,
      reviewed,
      pending: Math.max(reports.length - reviewed, 0),
    };
  }, [reports, reviewedReports]);

  const reportPostLookup = useMemo(() => {
    const lookup = new Map<number, Post>();
    posts
      .filter((post) => !removedPostIds.has(post.id))
      .forEach((post) => lookup.set(Number(post.id), post));
    return lookup;
  }, [posts, removedPostIds]);

  const visiblePosts = useMemo(
    () => posts.filter((post) => !removedPostIds.has(post.id)),
    [posts, removedPostIds],
  );

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
              <p className="text-2xl font-bold">{visiblePosts.length}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Báo cáo chờ xử lý</p>
              <p className="text-2xl font-bold">{reportStats.pending}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Đã xem xét</p>
              <p className="text-2xl font-bold">{reportStats.reviewed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Quản lý người dùng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <div className="text-center py-10 text-gray-500">
              Đang tải danh sách người dùng...
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-4">
              {users.map((adminUser) => (
                <div
                  key={adminUser.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{adminUser.email}</p>
                      <button
                        type="button"
                        className="font-semibold text-left text-blue-600 hover:underline"
                        onClick={() => setSelectedUser(adminUser)}
                      >
                        {adminUser.userName}
                      </button>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge
                          variant={
                            adminUser.isLocked ? "destructive" : "secondary"
                          }
                        >
                          {adminUser.isLocked ? "Đã khóa" : "Đang hoạt động"}
                        </Badge>
                        <Badge variant="outline">
                          {adminUser.roles?.[0] || "User"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={adminUser.roles?.[0] || "User"}
                        onChange={(event) =>
                          handleRoleChange(adminUser.id, event.target.value)
                        }
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>

                      {adminUser.isLocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnbanUser(adminUser.id)}
                        >
                          Mở khóa
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBanUser(adminUser.id)}
                        >
                          Khóa
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(adminUser.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Không có người dùng.
            </div>
          )}
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
          {loadingReports ? (
            <div className="text-center py-12 text-gray-500">
              Đang tải báo cáo...
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => {
                const post = reportPostLookup.get(report.postId);
                const isReviewed = reviewedReports.has(report.id);

                return (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge
                          variant={isReviewed ? "secondary" : "destructive"}
                        >
                          {isReviewed ? "Đã xem xét" : "Chờ xử lý"}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Lý do: {report.reason}
                        </p>
                        <p className="text-xs text-gray-400">
                          Báo cáo bởi: {report.userName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!isReviewed && (
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
                              onClick={() => handleRemovePost(report.postId)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="border-t pt-3">
                      {post ? (
                        <PostCard post={post} />
                      ) : (
                        <div className="rounded-lg border border-dashed bg-gray-50 p-4 text-sm text-gray-600">
                          <p className="font-medium text-gray-900">
                            Bài viết #{report.postId}
                          </p>
                          <p className="mt-1">
                            Bài viết này không còn trong danh sách bài viết hiện tại.
                            Có thể bài đã bị ẩn, đã bị xóa, hoặc không nằm trong feed
                            đang tải của quản trị viên.
                          </p>
                        </div>
                      )}
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
            {visiblePosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <PostCard post={post} />
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemovePost(Number(post.id))}
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

      <Dialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>Thông tin tài khoản chi tiết.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || DEFAULT_AVATAR}
                  alt={selectedUser.userName}
                  className="h-14 w-14 rounded-full object-cover border"
                />
                <div>
                  <p className="font-semibold">{selectedUser.userName}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium">Họ tên:</span>{" "}
                  {selectedUser.fullName || "—"}
                </div>
                <div>
                  <span className="font-medium">Số điện thoại:</span>{" "}
                  {selectedUser.phoneNumber || "—"}
                </div>
                <div>
                  <span className="font-medium">Ngày sinh:</span>{" "}
                  {formatDate(selectedUser.dateOfBirth)}
                </div>
                <div>
                  <span className="font-medium">Vai trò:</span>{" "}
                  {selectedUser.roles?.join(", ") || "User"}
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  {selectedUser.isLocked ? "Đã khóa" : "Đang hoạt động"}
                </div>
                <div className="whitespace-pre-line">
                  <span className="font-medium">Bio:</span>{" "}
                  {selectedUser.bio || "—"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
