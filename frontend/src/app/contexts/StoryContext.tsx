import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Story } from '../types';
import { mockStories } from '../data/mockData';
import { useAuth } from './AuthContext';

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

  useEffect(() => {
    // Load stories from localStorage or use mock data
    const savedStories = localStorage.getItem('stories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    } else {
      setStories(mockStories);
      localStorage.setItem('stories', JSON.stringify(mockStories));
    }
  }, []);

  useEffect(() => {
    // Save stories and clean up expired ones
    const activeStories = stories.filter(story => 
      new Date(story.expiresAt) > new Date()
    );
    
    if (activeStories.length !== stories.length) {
      setStories(activeStories);
    }
    
    if (stories.length > 0) {
      localStorage.setItem('stories', JSON.stringify(stories));
    }
  }, [stories]);

  const createStory = (image: string) => {
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

  const deleteStory = (storyId: string) => {
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
