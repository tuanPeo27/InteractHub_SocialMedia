import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search } from 'lucide-react';
import { usePosts } from '../contexts/PostContext';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import PostCard from '../components/PostCard';
import TrendingHashtags from '../components/TrendingHashtags';
import FriendSuggestions from '../components/FriendSuggestions';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const { searchPosts } = usePosts();
  
  const [searchResults, setSearchResults] = useState(searchPosts(initialQuery));

  useEffect(() => {
    if (debouncedQuery) {
      setSearchResults(searchPosts(debouncedQuery));
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

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
              type="text"
              placeholder="Tìm kiếm bài viết, người dùng, hashtag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
        </CardContent>
      </Card>

      {query ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Kết quả cho "{query}" ({searchResults.length})
          </h2>
          {searchResults.length > 0 ? (
            searchResults.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không tìm thấy kết quả nào</p>
                <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Tabs defaultValue="trending">
          <TabsList className="w-full">
            <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
            <TabsTrigger value="suggestions" className="flex-1">Gợi ý kết bạn</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            <TrendingHashtags />
          </TabsContent>

          <TabsContent value="suggestions" className="mt-6">
            <FriendSuggestions />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default SearchPage;
