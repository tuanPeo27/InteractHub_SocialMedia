using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Enums;
namespace backend.Services;

public class PrivacyService : IPrivacyService
{
    private readonly IFriendsService _friendService;

    public PrivacyService(IFriendsService friendService)
    {
        _friendService = friendService;
    }

    public async Task<bool> CanViewPost(Post post, string userId)
    {
        if (post.Visibility == PostVisibility.Public)
            return true;

        if (post.Visibility == PostVisibility.Private)
            return post.UserId == userId;

        if (post.Visibility == PostVisibility.Friends)
        {
            if (post.UserId == userId) return true;

            return await _friendService.IsFriend(userId, post.UserId);
        }

        return false;
    }
}