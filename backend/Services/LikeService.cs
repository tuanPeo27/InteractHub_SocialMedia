using Microsoft.EntityFrameworkCore;
using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Response;
using backend.DTOs.Request;

namespace backend.Services;

public class LikeService : ILikeService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;
    private readonly INotificationService _notificationService;

    public LikeService(AppDbContext context, IPrivacyService privacyService, INotificationService notificationService)
    {
        _context = context;
        _privacyService = privacyService;
        _notificationService = notificationService;
    }

    public async Task<bool> ToggleLike(int postId, string userId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
            throw new Exception("Post not found");

        // check quyền
        if (!await _privacyService.CanViewPost(post, userId))
            throw new UnauthorizedAccessException();

        var existing = await _context.Likes
            .FirstOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);

        if (existing != null)
        {
            _context.Likes.Remove(existing);
            await _context.SaveChangesAsync();
            return false;
        }

        var like = new Like
        {
            PostId = postId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Likes.Add(like);
        await _context.SaveChangesAsync();

        // Create notification for the post owner (only if the liker is not the post owner)
        if (post.UserId != userId)
        {
            var likerUser = await _context.Users.FindAsync(userId);
            var notificationRequest = new CreateNotificationRequest
            {
                UserId = post.UserId,
                FromUserId = userId,
                Content = $"{likerUser?.FullName ?? likerUser?.UserName} đã like bài viết của bạn",
                Type = "like"
            };
            await _notificationService.Create(notificationRequest);
        }

        return true;
    }

    public async Task<LikeResponse> GetLikeInfo(int postId, string userId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
            throw new Exception("Post not found");

        // check quyền
        if (!await _privacyService.CanViewPost(post, userId))
            throw new UnauthorizedAccessException();

        var total = await _context.Likes
            .CountAsync(x => x.PostId == postId);

        var isLiked = await _context.Likes
            .AnyAsync(x => x.PostId == postId && x.UserId == userId);

        return new LikeResponse
        {
            PostId = postId,
            TotalLikes = total,
            IsLiked = isLiked
        };
    }

    public async Task<LikeDetailResponse> GetLikeDetail(int postId, string userId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
            throw new Exception("Post not found");

        // check quyền xem post
        if (!await _privacyService.CanViewPost(post, userId))
            throw new UnauthorizedAccessException();

        var likes = await _context.Likes
            .Where(x => x.PostId == postId)
            .Include(x => x.User)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return new LikeDetailResponse
        {
            PostId = postId,
            TotalLikes = likes.Count,
            IsLikedByCurrentUser = likes.Any(x => x.UserId == userId),
            Users = likes.Select(x => new LikeUserResponse
            {
                UserId = x.UserId,
                UserName = x.User.UserName,
                Avatar = x.User.Avatar, // nếu có
                LikedAt = x.CreatedAt
            }).ToList()
        };
    }
}