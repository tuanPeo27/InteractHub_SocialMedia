namespace backend.Interfaces;

using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Entities;
public interface ICommentService
{
    Task<CommentResponse> CreateAsync(string userId, CreateCommentRequest dto);
    Task<List<CommentResponse>> GetByPost(int postId, string userId);
    Task<bool> DeleteAsync(int id, string userId);
}