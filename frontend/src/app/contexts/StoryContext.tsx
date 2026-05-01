import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Story } from '../types';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';
import { storiesService } from '../services/storiesService';
import { toFrontendStory } from '../services/mappers';

interface StoryContextType {
  stories: Story[];
  createStory: (image: string) => void;
  viewStory: (storyId: string) => void;
  deleteStory: (storyId: string) => void;
  getActiveStories: () => Story[];
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const StoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<Story[]>([]);
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    const loadStories = async () => {
      if (!user || usersLoading) {
        setStories([]);
        return;
      }

      try {
        const apiStories = await storiesService.getFeed();
        const userLookup = new Map(users.map((item) => [item.id, item] as const));
        setStories(apiStories.map((story) => toFrontendStory(story, userLookup)));
      } catch {
        setStories([]);
      }
    };

    void loadStories();
  }, [user, usersLoading, users.length]);

  const createStory = async (image: string) => {
    if (!user) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newStory: Story = {
      id: `s${Date.now()}`,
      userId: user.id,
      user: user,
      image,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      views: [],
    };

    await storiesService.create(image);
    setStories([newStory, ...stories]);
  };

  const viewStory = (storyId: string) => {
    if (!user) return;

    setStories(stories.map(story => {
      if (story.id === storyId && !story.views.includes(user.id)) {
        return { ...story, views: [...story.views, user.id] };
      }
      return story;
    }));
  };

  const deleteStory = async (storyId: string) => {
    await storiesService.delete(storyId);
    setStories(stories.filter(story => story.id !== storyId));
  };

  const getActiveStories = () => {
    return stories.filter(story => new Date(story.expiresAt) > new Date());
  };

  return (
    <StoryContext.Provider
      value={{
        stories: getActiveStories(),
        createStory,
        viewStory,
        deleteStory,
        getActiveStories,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
};

export const useStories = () => {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStories must be used within StoryProvider');
  }
  return context;
};
