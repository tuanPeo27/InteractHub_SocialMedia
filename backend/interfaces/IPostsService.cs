namespace backend.Interfaces;

using backend.DTOs.Response;
using backend.DTOs.Request;
using backend.Models.Entities;
public interface IPostsService
{
    Task<List<PostResponse>> GetAllAsync();
    Task<PostResponse?> GetByIdAsync(int id);
    Task<PostResponse> CreateAsync(CreatePostRequest dto, string userId);
    Task<bool> UpdateAsync(int id, UpdatePostRequest dto);
    Task<bool> DeleteAsync(int id);
}