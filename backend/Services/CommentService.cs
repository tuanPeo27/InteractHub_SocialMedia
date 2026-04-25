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

    public CommentService(AppDbContext context, IPrivacyService privacyService)
    {
        _context = context;
        _privacyService = privacyService;
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