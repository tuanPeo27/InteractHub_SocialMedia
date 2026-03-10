import React, { useEffect, useRef } from 'react';
import { usePosts } from '../contexts/PostContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import StoryReel from '../components/StoryReel';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';

const HomePage: React.FC = () => {
  const { posts, loading } = usePosts();
  const { displayedItems, hasMore, loadMore } = useInfiniteScroll({ items: posts, itemsPerPage: 5 });
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Story Reel */}
      <StoryReel />

      {/* Create Post */}
      <CreatePostForm />

      {/* Posts Feed */}
      <div className="space-y-4">
        {displayedItems.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        {displayedItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Chưa có bài viết nào</p>
            <p className="text-sm mt-2">Hãy tạo bài viết đầu tiên của bạn!</p>
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={observerRef} className="py-4 text-center">
            <Button variant="outline" onClick={loadMore}>
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
