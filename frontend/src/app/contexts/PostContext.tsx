import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Comment, Post } from '../types';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';
import { commentsService } from '../services/commentsService';
import { likesService } from '../services/likesService';
import { postsService } from '../services/postsService';
import { toFrontendPost } from '../services/mappers';
import type { ApiComment, ApiLikeInfo } from '../services/types';

interface PostContextType {
  posts: Post[];
  loading: boolean;
  createPost: (content: string, images: string[], hashtags: string[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  sharePost: (postId: string) => void;
  deletePost: (postId: string) => Promise<void>;
  getPostById: (postId: string) => Post | undefined;
  getPostsByHashtag: (hashtag: string) => Post[];
  searchPosts: (query: string) => Post[];
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    if (usersLoading) return;

    const loadPosts = async () => {
      setLoading(true);
      try {
        const apiPosts = await postsService.getFeed();

        const details = await Promise.all(
          apiPosts.map(async (post) => ({
            post,
            comments: await commentsService.getByPost(String(post.id)).catch(() => [] as ApiComment[]),
            likeInfo: await likesService.getInfo(String(post.id)).catch(() => null as ApiLikeInfo | null),
          })),
        );

        const userLookup = new Map(users.map(u => [u.id, u]));
        const commentLookup = new Map();
        const likeLookup = new Map();

        details.forEach((detail) => {
          commentLookup.set(detail.post.id, detail.comments);
          if (detail.likeInfo) {
            likeLookup.set(detail.post.id, detail.likeInfo);
          }
        });

        setPosts(apiPosts.map(post =>
          toFrontendPost(post, userLookup, commentLookup, likeLookup, user?.id)
        ));
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [usersLoading, user?.id]);

  // console.log("posts:", posts);
  const createPost = async (content: string, images: string[], hashtags: string[]) => {
    if (!user) return;

    const imageUrl = images[0] || null;
    const serverContent = hashtags.length > 0 ? `${content} ${hashtags.map((tag) => `#${tag}`).join(' ')}` : content;
    const createdPost = await postsService.create(serverContent, imageUrl);
    const userLookup = new Map(users.map((item) => [item.id, item] as const));
    const nextPost = toFrontendPost(createdPost, userLookup, new Map<number, ApiComment[]>(), new Map<number, ApiLikeInfo>(), user.id);

    setPosts((current) => [nextPost, ...current]);
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    await likesService.toggle(postId);
    const likeInfo = await likesService.getInfo(postId);

    setPosts((current) => current.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      const likes = likeInfo.isLiked
        ? [user.id, ...Array.from({ length: Math.max(likeInfo.totalLikes - 1, 0) }, (_, index) => `like-${postId}-${index}`)]
        : Array.from({ length: likeInfo.totalLikes }, (_, index) => `like-${postId}-${index}`);

      return { ...post, likes };
    }));
  };

  const unlikePost = async (postId: string) => {
    await likePost(postId);
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    const createdComment = await commentsService.create(Number(postId), content);
    const userLookup = new Map(users.map((item) => [item.id, item] as const));

    const comment: Comment = {
      id: String(createdComment.id),
      postId: String(createdComment.postId),
      userId: createdComment.userId,
      user: userLookup.get(createdComment.userId) || user,
      content: createdComment.content,
      createdAt: createdComment.createdAt,
    };

    setPosts((current) => current.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: [comment, ...post.comments] };
      }

      return post;
    }));
  };

  const deleteComment = async (postId: string, commentId: string) => {
    await commentsService.delete(commentId);
    setPosts((current) => current.map((post) => {
      if (post.id === postId) {
        return { ...post, comments: post.comments.filter((c) => c.id !== commentId) };
      }

      return post;
    }));
  };

  const sharePost = (postId: string) => {
    setPosts((current) => current.map((post) => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }

      return post;
    }));
  };

  const deletePost = async (postId: string) => {
    await postsService.delete(postId);
    setPosts((current) => current.filter((post) => post.id !== postId));
  };

  const getPostById = (postId: string) => posts.find((post) => post.id === postId);

  const getPostsByHashtag = (hashtag: string) => posts.filter((post) =>
    post.hashtags.some((tag) => tag.toLowerCase() === hashtag.toLowerCase()),
  );

  const searchPosts = (query: string) => {
    const lowerQuery = query.toLowerCase();

    return posts.filter((post) =>
      post.content.toLowerCase().includes(lowerQuery) ||
      post.user.fullName.toLowerCase().includes(lowerQuery) ||
      post.user.username.toLowerCase().includes(lowerQuery) ||
      post.hashtags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        createPost,
        likePost,
        unlikePost,
        addComment,
        deleteComment,
        sharePost,
        deletePost,
        getPostById,
        getPostsByHashtag,
        searchPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error('usePosts must be used within PostProvider');
  }

  return context;
};
