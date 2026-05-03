using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Enums;
namespace backend.Services;

// Services/PostService.cs
public class PostsService : IPostsService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;
    private readonly IHashtagService _hashtagService;

    public PostsService(AppDbContext context, IPrivacyService privacyService, IHashtagService hashtagService)
    {
        _privacyService = privacyService;
        _context = context;
        _hashtagService = hashtagService;
    }

    public async Task<List<PostResponse>> GetFeed(string currentUserId)
    {
        var posts = await _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var result = new List<PostResponse>();

        foreach (var post in posts)
        {
            if (await _privacyService.CanViewPost(post, currentUserId))
            {
                result.Add(Map(post));
            }
        }

        return result;
    }

    public async Task<List<PostResponse>> GetMyPosts(string userId)
    {
        var posts = await _context.Posts
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return posts.Select(p => Map(p)).ToList();
    }

    public async Task<PostResponse> GetById(int id, string currentUserId)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return null;

        if (!await _privacyService.CanViewPost(post, currentUserId))
            throw new UnauthorizedAccessException();

        return Map(post);
    }

    public async Task<PostResponse> CreateAsync(CreatePostRequest dto, string userId)
    {
        var post = new Post
        {
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            UserId = userId,
            Visibility = dto.Visibility,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow


        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        await _hashtagService.AddHashtagsToPost(post.Id, post.Content);
        return new PostResponse
        {
            Id = post.Id,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            UserId = post.UserId,
            Visibility = (int)post.Visibility,
            CreatedAt = post.CreatedAt,
            UpdatedAt = post.UpdatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, string currentUserId, UpdatePostRequest dto)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) throw new Exception("Post not found");

        if (post.UserId != currentUserId)
            throw new UnauthorizedAccessException("You cannot edit this post");

        post.Content = dto.Content ?? post.Content;
        post.ImageUrl = dto.ImageUrl ?? post.ImageUrl;
        post.Visibility = dto.Visibility ?? post.Visibility;
        post.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return false;

        if (post.UserId != userId)
            throw new UnauthorizedAccessException();

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return true;
    }

    private PostResponse Map(Post p)
    {
        return new PostResponse
        {
            Id = p.Id,
            Content = p.Content,
            ImageUrl = p.ImageUrl,
            UserId = p.UserId,
            Visibility = (int)p.Visibility,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        };
    }
}