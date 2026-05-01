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
    private readonly RoleManager<IdentityRole> _roleManager;

    public AdminService(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
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
        var users = await _userManager.Users.ToListAsync();
        var results = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            results.Add(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                IsLocked = user.LockoutEnd != null && user.LockoutEnd > DateTimeOffset.Now,
                Roles = roles.ToList(),
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Avatar = user.Avatar,
                Bio = user.Bio,
                DateOfBirth = user.DateOfBirth,
            });
        }

        return results;
    }

    public async Task<bool> SetUserRoleAsync(string userId, string roleName)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        if (!await _roleManager.RoleExistsAsync(roleName))
        {
            var createRole = await _roleManager.CreateAsync(new IdentityRole(roleName));
            if (!createRole.Succeeded) return false;
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Count > 0)
        {
            var removeResult = await _userManager.RemoveFromRolesAsync(user, roles);
            if (!removeResult.Succeeded) return false;
        }

        var addResult = await _userManager.AddToRoleAsync(user, roleName);
        return addResult.Succeeded;
    }
}