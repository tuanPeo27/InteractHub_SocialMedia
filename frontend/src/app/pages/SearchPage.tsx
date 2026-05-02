import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Search } from 'lucide-react';

import { usePosts } from '../contexts/PostContext';
import { useUsers } from '../contexts/UsersContext';
import { useDebounce } from '../hooks/useDebounce';

import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import TrendingHashtags from '../components/TrendingHashtags';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const { searchPosts } = usePosts();
  const { users } = useUsers();

  const [postResults, setPostResults] = useState(searchPosts(initialQuery));

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setPostResults(searchPosts(debouncedQuery));
    } else {
      setPostResults([]);
    }
  }, [debouncedQuery, searchPosts]);

  const userResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];

    return users.filter((user) =>
      user.fullName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [users, debouncedQuery]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Tìm kiếm
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Tìm bài viết hoặc người dùng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {query ? (
        <Tabs defaultValue="posts">
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">
              Bài viết ({postResults.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1">
              Người dùng ({userResults.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-4">
            {postResults.length > 0 ? (
              postResults.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p>Không tìm thấy bài viết</p>
            )}
          </TabsContent>

          <TabsContent value="users" className="mt-6 space-y-4">
            {userResults.length > 0 ? (
              userResults.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            ) : (
              <p>Không tìm thấy người dùng</p>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <TrendingHashtags />
      )}
    </div>
  );
};

export default SearchPage;