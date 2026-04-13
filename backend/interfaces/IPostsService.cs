namespace backend.Interfaces;

using backend.Models.Entities;
public interface IPostsService
{
    Task<List<PostDTO>> GetAllAsync();
    Task<PostDTO?> GetByIdAsync(int id);
    Task<PostDTO> CreateAsync(CreatePostDTO dto, string userId);
    Task<bool> UpdateAsync(int id, UpdatePostDTO dto);
    Task<bool> DeleteAsync(int id);
}