namespace backend.Interfaces;

using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Entities;
public interface IHashtagService
{
    Task AddHashtagsToPost(int postId, string content);
    Task<List<PostResponse>> GetPostsByHashtag(string hashtag, string userId);
}