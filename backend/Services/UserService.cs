using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // 🔥 MAP FUNCTION
    private UserResponse MapUser(ApplicationUser user)
    {
        return new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            FullName = user.FullName,
            Avatar = user.Avatar,
            Bio = user.Bio,
            DateOfBirth = user.DateOfBirth
        };
    }

    public async Task<UserResponse?> GetCurrentUser(ClaimsPrincipal principal)
    {
        var user = await _userManager.GetUserAsync(principal);
        if (user == null) return null;

        return MapUser(user);
    }

    public List<UserResponse> GetAll()
    {
        return _userManager.Users
            .Select(u => MapUser(u))
            .ToList();
    }

    public async Task<UserResponse?> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return null;

        return MapUser(user);
    }

    public async Task<UserResponse?> Update(string id, UpdateUserRequest model)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return null;

        // Update username
        if (!string.IsNullOrEmpty(model.UserName) && model.UserName != user.UserName)
        {
            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null)
                throw new Exception("Username đã tồn tại");

            var setResult = await _userManager.SetUserNameAsync(user, model.UserName);
            if (!setResult.Succeeded)
                throw new Exception("Không thể cập nhật username");
        }

        // Update fields
        user.FullName = model.FullName ?? user.FullName;
        user.Bio = model.Bio ?? user.Bio;
        user.Avatar = model.Avatar ?? user.Avatar;
        user.DateOfBirth = model.DateOfBirth ?? user.DateOfBirth;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));

        return MapUser(user);
    }

    public async Task<bool> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return false;

        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }
}