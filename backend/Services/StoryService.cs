
using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Services;

public class StoryService : IStoryService
{
    private readonly AppDbContext _context;

    public StoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(string userId, StoryCreateRequest dto)
    {
        if (string.IsNullOrEmpty(dto.ImageUrl) && string.IsNullOrEmpty(dto.Content))
            throw new Exception("Story phải có content hoặc image");

        var story = new Story
        {
            ImageUrl = dto.ImageUrl,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,

            ExpiredAt = dto.ExpiresAt == default
                ? DateTime.UtcNow.AddHours(24)
                : dto.ExpiresAt
        };

        _context.Stories.Add(story);
        await _context.SaveChangesAsync();
    }
}