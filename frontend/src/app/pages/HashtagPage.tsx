import React from 'react';
import { useParams } from 'react-router';
import { Hash } from 'lucide-react';
import { usePosts } from '../contexts/PostContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import PostCard from '../components/PostCard';

const HashtagPage: React.FC = () => {
  const { tag } = useParams();
  const { getPostsByHashtag } = usePosts();

  const posts = tag ? getPostsByHashtag(tag) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Hash className="w-7 h-7" />
            {tag}
          </CardTitle>
          <p className="text-gray-600">{posts.length} bài viết</p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <Card>
            <CardContent className="text-center py-12 text-gray-500">
              <Hash className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có bài viết nào với hashtag này</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HashtagPage;
