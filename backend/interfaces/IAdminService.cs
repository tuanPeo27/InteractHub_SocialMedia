using backend.DTOs.Response;
using backend.DTOs.Request;
public interface IAdminService
{
    Task<IEnumerable<ReportResponse>> GetReportsAsync();
    Task<bool> DeletePostAsync(int postId);
    Task<bool> BanUserAsync(string userId);
    Task<bool> UnbanUserAsync(string userId);
    Task<IEnumerable<UserDto>> GetUsersAsync();
    Task<bool> SetUserRoleAsync(string userId, string roleName);
}