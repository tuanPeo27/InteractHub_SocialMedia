using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Services;


public class ReportService : IReportService
{
    private readonly AppDbContext _context;
    private readonly IPrivacyService _privacyService;

    public ReportService(AppDbContext context, IPrivacyService privacyService)
    {
        _context = context;
        _privacyService = privacyService;
    }

    public async Task<bool> CreateReportAsync(string userId, CreateReportRequest dto)
    {
        var post = await _context.Posts.FindAsync(dto.PostId);
        if (post == null)
            throw new Exception("Post not found");

        // check quyền
        if (!await _privacyService.CanViewPost(post, userId))
            throw new UnauthorizedAccessException("Cannot report this post");

        // không cho report chính mình
        if (post.UserId == userId)
            throw new Exception("Cannot report your own post");

        // chống spam report
        var exists = await _context.PostReports
            .AnyAsync(r => r.PostId == dto.PostId && r.UserId == userId);

        if (exists)
            throw new Exception("You already reported this post");

        var report = new PostReport
        {
            PostId = dto.PostId,
            Reason = dto.Reason,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.PostReports.Add(report);
        await _context.SaveChangesAsync();

        return true;
    }
}