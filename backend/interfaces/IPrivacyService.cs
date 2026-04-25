namespace backend.Interfaces;

using backend.DTOs.Response;
using backend.DTOs.Request;
using backend.Models.Entities;
public interface IPrivacyService
{
    Task<bool> CanViewPost(Post post, string userId);
}