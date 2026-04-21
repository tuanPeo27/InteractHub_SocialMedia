namespace backend.Interfaces;

using backend.Models.Entities;
public interface IStoryService
{
    Task CreateAsync(string userId, StoryCreateDto dto);
}