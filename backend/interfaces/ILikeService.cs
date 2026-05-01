
namespace backend.Interfaces;

using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Entities;

public interface ILikeService
{
    Task<bool> ToggleLike(int postId, string userId);
    Task<LikeResponse> GetLikeInfo(int postId, string userId);
    Task<LikeDetailResponse> GetLikeDetail(int postId, string userId);
}