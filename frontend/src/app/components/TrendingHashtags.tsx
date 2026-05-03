import React from 'react';
import { Link } from 'react-router';
import { Hash, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { usePosts } from '../contexts/PostContext';

const TrendingHashtags: React.FC = () => {
  const { posts } = usePosts();

  const hashtagCounts = posts.reduce((acc, post) => {
    const uniqueTags = new Set(post.hashtags);

    uniqueTags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });

    return acc;
  }, {} as Record<string, number>);

  const trendingHashtags = Object.entries(hashtagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Hashtag Trending
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingHashtags.length > 0 ? trendingHashtags.map((item, index) => (
          <Link
            key={item.tag}
            to={`/hashtag/${item.tag}`}
            className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Hash className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-600">#{item.tag}</p>
                  <p className="text-sm text-gray-500">{item.count} bài viết</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
            </div>
          </Link>
        )) : <p className="text-sm text-gray-500">Chưa có hashtag nào</p>}
      </CardContent>
    </Card>
  );
};

export default TrendingHashtags;
