using Microsoft.EntityFrameworkCore;
using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Response;

namespace backend.Services;

public class LikeService : ILikeService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;

    public LikeService(AppDbContext context, IPrivacyService privacyService)
    {
        _context = context;
        _privacyService = privacyService;
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
}