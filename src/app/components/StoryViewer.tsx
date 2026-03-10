import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Story } from '../types';
import { useStories } from '../contexts/StoryContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface StoryViewerProps {
  storyGroups: Story[][];
  initialGroupIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ storyGroups, initialGroupIndex, onClose }) => {
  const { viewStory } = useStories();
  const [currentGroupIndex, setCurrentGroupIndex] = useState(initialGroupIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentGroup = storyGroups[currentGroupIndex];
  const currentStory = currentGroup[currentStoryIndex];
  const hasNext = currentGroupIndex < storyGroups.length - 1 || currentStoryIndex < currentGroup.length - 1;
  const hasPrevious = currentGroupIndex > 0 || currentStoryIndex > 0;

  useEffect(() => {
    // Mark story as viewed
    viewStory(currentStory.id);

    // Auto-progress timer
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentGroupIndex, currentStoryIndex]);

  const handleNext = () => {
    if (currentStoryIndex < currentGroup.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else if (currentGroupIndex < storyGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
      setCurrentStoryIndex(storyGroups[currentGroupIndex - 1].length - 1);
    }
  };

  return (
    <div className="relative h-[80vh] bg-black flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
        {currentGroup.map((_, index) => (
          <Progress
            key={index}
            value={
              index < currentStoryIndex ? 100 :
              index === currentStoryIndex ? progress :
              0
            }
            className="h-1 flex-1 bg-white/30"
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 border-2 border-white">
            <AvatarImage src={currentStory.user.avatar} alt={currentStory.user.fullName} />
            <AvatarFallback>{currentStory.user.fullName[0]}</AvatarFallback>
          </Avatar>
          <div className="text-white">
            <p className="font-medium">{currentStory.user.fullName}</p>
            <p className="text-xs opacity-80">
              {formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true, locale: vi })}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Story Image */}
      <img
        src={currentStory.image}
        alt="Story"
        className="max-w-full max-h-full object-contain"
      />

      {/* Navigation */}
      {hasPrevious && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}
    </div>
  );
};

export default StoryViewer;
