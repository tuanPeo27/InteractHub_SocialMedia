using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using backend.DTOs.Request;
using backend.DTOs.Response;

using backend.Interfaces;
using backend.Models.Entities;

namespace backend.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminService(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IEnumerable<ReportResponse>> GetReportsAsync()
    {
        return await _context.PostReports
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt) // 🔥 sort mới nhất
            .Select(r => new ReportResponse
            {
                Id = r.Id,
                PostId = r.PostId,
                Reason = r.Reason,
                UserName = r.User.UserName,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> DeletePostAsync(int postId)
    {
        var post = await _context.Posts.FindAsync(postId);
        if (post == null) return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BanUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.LockoutEnd = DateTimeOffset.MaxValue;
        await _userManager.UpdateAsync(user);
        return true;
    }

    public async Task<bool> UnbanUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.LockoutEnd = null;
        await _userManager.UpdateAsync(user);
        return true;
    }

    public async Task<IEnumerable<UserDto>> GetUsersAsync()
    {
        return await _userManager.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                IsLocked = u.LockoutEnd != null && u.LockoutEnd > DateTimeOffset.Now
            })
            .ToListAsync();
    }
}