using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Services;

// Services/PostService.cs
public class PostsService : IPostsService
{
    private readonly AppDbContext _context;

    public PostsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PostResponse>> GetAllAsync()
    {
        return await _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostResponse
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                UserId = p.UserId,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<PostResponse?> GetByIdAsync(int id)
    {
        return await _context.Posts
            .Where(p => p.Id == id)
            .Select(p => new PostResponse
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                UserId = p.UserId,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<PostResponse> CreateAsync(CreatePostRequest dto, string userId)
    {
        var post = new Post
        {
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            UserId = userId
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            UserId = post.UserId,
            CreatedAt = post.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdatePostRequest dto)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return false;

        post.Content = dto.Content ?? post.Content;
        post.ImageUrl = dto.ImageUrl ?? post.ImageUrl;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }
}