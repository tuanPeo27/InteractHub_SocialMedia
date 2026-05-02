using Microsoft.EntityFrameworkCore;
using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;

namespace backend.Services;

public class CommentService : ICommentService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;
    private readonly INotificationService _notificationService;

    public CommentService(AppDbContext context, IPrivacyService privacyService, INotificationService notificationService)
    {
        _context = context;
        _privacyService = privacyService;
        _notificationService = notificationService;
    }

    public async Task<CommentResponse> CreateAsync(string userId, CreateCommentRequest dto)
    {
        var post = await _context.Posts.FindAsync(dto.PostId);
        if (post == null)
            throw new Exception("Post not found");

        // check quyền
        if (!await _privacyService.CanViewPost(post, userId))
            throw new UnauthorizedAccessException();

        var comment = new Comment
        {
            Content = dto.Content,
            UserId = userId,
            PostId = dto.PostId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // Create notification for the post owner (only if the commenter is not the post owner)
        if (post.UserId != userId)
        {
            var commenterUser = await _context.Users.FindAsync(userId);
            var notificationRequest = new CreateNotificationRequest
            {
                UserId = post.UserId,
                FromUserId = userId,
                Content = $"{commenterUser?.FullName ?? commenterUser?.UserName} đã bình luận trên bài viết của bạn",
                Type = "comment"
            };
            await _notificationService.Create(notificationRequest);
        }

        return Map(comment);
    }

    public async Task<List<CommentResponse>> GetByPost(int postId, string userId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null)
            throw new Exception("Post not found");

        // check quyền 
        if (!await _privacyService.CanViewPost(post, userId))
            throw new UnauthorizedAccessException();

        var comments = await _context.Comments
            .Where(c => c.PostId == postId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return comments.Select(Map).ToList();
    }


    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return false;

        var post = await _context.Posts.FindAsync(comment.PostId);
        if (post == null) return false;


        if (comment.UserId != userId && post.UserId != userId) // Chủ comment và chủ bài đc xóa
            return false;

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return true;
    }

    private CommentResponse Map(Comment c)
    {
        return new CommentResponse
        {
            Id = c.Id,
            Content = c.Content,
            UserId = c.UserId,
            PostId = c.PostId,
            CreatedAt = c.CreatedAt
        };
    }
}