
using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Enums;
using Microsoft.EntityFrameworkCore;
namespace backend.Services;

public class StoryService : IStoryService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;

    public StoryService(AppDbContext context, IPrivacyService privacyService)
    {
        _context = context;
        _privacyService = privacyService;
    }
    // 👉 TẠO STORY
    public async Task<StoryResponse> CreateAsync(string userId, CreateStoryRequest dto)
    {
        var story = new Story
        {
            ImageUrl = dto.ImageUrl,
            UserId = userId,
            Visibility = dto.Visibility,
            CreatedAt = DateTime.UtcNow,
            ExpiredAt = DateTime.UtcNow.AddHours(24) // 24h
        };

        _context.Stories.Add(story);
        await _context.SaveChangesAsync();

        return Map(story);


    }

    public async Task<List<StoryResponse>> GetMyStories(string userId)
    {
        var stories = await _context.Stories
       .Where(s => s.UserId == userId && s.ExpiredAt > DateTime.UtcNow)
       .OrderByDescending(s => s.CreatedAt)
       .ToListAsync();

        return stories.Select(s => Map(s)).ToList();

    }

    public async Task<List<StoryResponse>> GetFeed(string userId)
    {
        var stories = await _context.Stories
            .Where(s => s.ExpiredAt > DateTime.UtcNow)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        var result = new List<StoryResponse>();

        foreach (var story in stories)
        {
            var fakePost = new Post
            {
                UserId = story.UserId,
                Visibility = story.Visibility
            };

            if (await _privacyService.CanViewPost(fakePost, userId))
            {
                result.Add(Map(story));
            }
        }

        return result;
    }

    public async Task<bool> DeleteAsync(int id, string userId)
    {
        var story = await _context.Stories.FindAsync(id);
        if (story == null) return false;

        if (story.UserId != userId)
            throw new UnauthorizedAccessException();

        _context.Stories.Remove(story);
        await _context.SaveChangesAsync();

        return true;
    }

    private StoryResponse Map(Story s)
    {
        return new StoryResponse
        {
            Id = s.Id,
            ImageUrl = s.ImageUrl,
            UserId = s.UserId,
            CreatedAt = s.CreatedAt
        };
    }
}