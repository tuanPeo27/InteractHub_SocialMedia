using Microsoft.EntityFrameworkCore;
using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Response;

namespace backend.Services;

public class HashtagService : IHashtagService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;

    public HashtagService(AppDbContext context, IPrivacyService privacyService)
    {
        _context = context;
        _privacyService = privacyService;
    }

    // tách hashtag từ content
    private List<string> ExtractHashtags(string content)
    {
        return content
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(x => x.StartsWith("#"))
            .Select(x => x.ToLower().Trim())
            .Distinct()
            .ToList();
    }

    // gắn hashtag vào post
    public async Task AddHashtagsToPost(int postId, string content)
    {
        var tags = ExtractHashtags(content);

        foreach (var tag in tags)
        {
            var hashtag = await _context.Hashtags
                .FirstOrDefaultAsync(x => x.Name == tag);

            if (hashtag == null)
            {
                hashtag = new Hashtag { Name = tag };
                _context.Hashtags.Add(hashtag);
                await _context.SaveChangesAsync();
            }

            var exists = await _context.PostHashtags
                .AnyAsync(x => x.PostId == postId && x.HashtagId == hashtag.Id);

            if (!exists)
            {
                _context.PostHashtags.Add(new PostHashtag
                {
                    PostId = postId,
                    HashtagId = hashtag.Id
                });
            }
        }

        await _context.SaveChangesAsync();
    }

    // lấy post có check quyền
    public async Task<List<PostResponse>> GetPostsByHashtag(string hashtag, string userId)
    {
        hashtag = hashtag.ToLower();

        var posts = await _context.PostHashtags
            .Where(x => x.Hashtag.Name == hashtag)
            .Select(x => x.Post)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var result = new List<PostResponse>();

        foreach (var post in posts)
        {
            if (await _privacyService.CanViewPost(post, userId))
            {
                result.Add(new PostResponse
                {
                    Id = post.Id,
                    Content = post.Content,
                    ImageUrl = post.ImageUrl,
                    UserId = post.UserId,
                    CreatedAt = post.CreatedAt,
                    UpdatedAt = post.UpdatedAt
                });
            }
        }

        return result;
    }
}