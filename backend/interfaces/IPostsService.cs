namespace backend.Interfaces;

using backend.DTOs.Response;
using backend.DTOs.Request;
using backend.Models.Entities;
public interface IPostsService
{
    Task<List<PostResponse>> GetFeed(string currentUserId);
    Task<List<PostResponse>> GetMyPosts(string userId);
    Task<PostResponse> GetById(int id, string currentUserId);
    Task<PostResponse> CreateAsync(CreatePostRequest dto, string userId);
    Task<bool> UpdateAsync(int id, string currentUserId, UpdatePostRequest dto);
    Task<bool> DeleteAsync(int id, string userId);
}