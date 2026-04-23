using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Services;

public class ReportService : IReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CreateReportAsync(string userId, CreateReportRequest dto)
    {
        var report = new PostReport
        {
            PostId = dto.PostId,
            Reason = dto.Reason,
            UserId = userId
        };

        _context.PostReports.Add(report);
        await _context.SaveChangesAsync();

        return true;
    }
}