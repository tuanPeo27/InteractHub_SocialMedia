namespace backend.Interfaces;

using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Entities;
public interface IStoryService
{
    Task<StoryResponse> CreateAsync(string userId, CreateStoryRequest dto);
    Task<List<StoryResponse>> GetMyStories(string userId);
    Task<List<StoryResponse>> GetFeed(string userId);
    Task<bool> DeleteAsync(int id, string userId);
}