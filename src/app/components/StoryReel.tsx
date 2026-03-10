import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStories } from '../contexts/StoryContext';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import StoryViewer from './StoryViewer';
import CreateStoryDialog from './CreateStoryDialog';

const StoryReel: React.FC = () => {
  const { user } = useAuth();
  const { stories } = useStories();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = [];
    }
    acc[story.userId].push(story);
    return acc;
  }, {} as Record<string, typeof stories>);

  const userStoryGroups = Object.values(groupedStories);
  const hasOwnStory = user ? groupedStories[user.id]?.length > 0 : false;

  return (
    <>
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-3 pb-2">
          {/* Create Story Button */}
          <button
            onClick={() => setShowCreateStory(true)}
            className="flex-shrink-0 relative"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-white p-0.5">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user?.avatar} alt={user?.fullName} />
                  <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <p className="text-xs mt-1 text-center font-medium">
              {hasOwnStory ? 'Story của bạn' : 'Tạo story'}
            </p>
          </button>

          {/* Story List */}
          {userStoryGroups.map((userStories, index) => {
            const story = userStories[0];
            const hasViewed = user ? story.views.includes(user.id) : false;

            return (
              <button
                key={story.userId}
                onClick={() => setSelectedStoryIndex(index)}
                className="flex-shrink-0"
              >
                <div className={`w-20 h-20 rounded-full p-1 ${
                  hasViewed 
                    ? 'bg-gray-300' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  <Avatar className="w-full h-full border-2 border-white">
                    <AvatarImage src={story.user.avatar} alt={story.user.fullName} />
                    <AvatarFallback>{story.user.fullName[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs mt-1 text-center font-medium truncate w-20">
                  {story.user.username}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Viewer Dialog */}
      <Dialog open={selectedStoryIndex !== null} onOpenChange={(open) => !open && setSelectedStoryIndex(null)}>
        <DialogContent className="max-w-md p-0 bg-black">
          {selectedStoryIndex !== null && (
            <StoryViewer
              storyGroups={userStoryGroups}
              initialGroupIndex={selectedStoryIndex}
              onClose={() => setSelectedStoryIndex(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Story Dialog */}
      <CreateStoryDialog open={showCreateStory} onClose={() => setShowCreateStory(false)} />
    </>
  );
};

export default StoryReel;
