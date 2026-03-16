import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Comment } from '../types';
import { mockPosts } from '../data/mockData';
import { useAuth } from './AuthContext';

interface PostContextType {
  posts: Post[];
  loading: boolean;
  createPost: (content: string, images: string[], hashtags: string[]) => void;
  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  sharePost: (postId: string) => void;
  deletePost: (postId: string) => void;
  getPostById: (postId: string) => Post | undefined;
  getPostsByHashtag: (hashtag: string) => Post[];
  searchPosts: (query: string) => Post[];
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load posts from localStorage or use mock data
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(mockPosts);
      localStorage.setItem('posts', JSON.stringify(mockPosts));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save posts to localStorage whenever they change
    if (!loading) {
      localStorage.setItem('posts', JSON.stringify(posts));
    }
  }, [posts, loading]);

  const createPost = (content: string, images: string[], hashtags: string[]) => {
    if (!user) return;

    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: user.id,
      user: user,
      content,
      images,
      likes: [],
      comments: [],
      shares: 0,
      hashtags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
  };

  const likePost = (postId: string) => {
    if (!user) return;

    setPosts(posts.map(post => {
      if (post.id === postId && !post.likes.includes(user.id)) {
        return { ...post, likes: [...post.likes, user.id] };
      }
      return post;
    }));
  };

  const unlikePost = (postId: string) => {
    if (!user) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes.filter(id => id !== user.id) };
      }
      return post;
    }));
  };

  const addComment = (postId: string, content: string) => {
    if (!user) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId,
      userId: user.id,
      user: user,
      content,
      createdAt: new Date().toISOString(),
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const sharePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return { ...post, shares: post.shares + 1 };
      }
      return post;
    }));
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const getPostById = (postId: string) => {
    return posts.find(post => post.id === postId);
  };

  const getPostsByHashtag = (hashtag: string) => {
    return posts.filter(post => 
      post.hashtags.some(tag => tag.toLowerCase() === hashtag.toLowerCase())
    );
  };

  const searchPosts = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return posts.filter(post =>
      post.content.toLowerCase().includes(lowerQuery) ||
      post.user.fullName.toLowerCase().includes(lowerQuery) ||
      post.user.username.toLowerCase().includes(lowerQuery) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(lowerQuery))
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
