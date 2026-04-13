using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

using backend.Interfaces;
using backend.Models.Entities;

namespace backend.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // 🔥 GET CURRENT USER
    public async Task<UserResponse?> GetCurrentUser(ClaimsPrincipal user)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null) return null;

        var currentUser = await _userManager.FindByIdAsync(userId);

        if (currentUser == null) return null;

        return new UserResponse
        {
            Id = currentUser.Id,
            UserName = currentUser.UserName ?? "",
            Email = currentUser.Email ?? ""
        };
    }

    // 🔥 GET ALL USERS
    public IEnumerable<UserResponse> GetAll()
    {
        return _userManager.Users.Select(u => new UserResponse
        {
            Id = u.Id,
            UserName = u.UserName ?? "",
            Email = u.Email ?? ""
        }).ToList();
    }

    // 🔥 GET USER BY ID
    public async Task<UserResponse?> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null) return null;

        return new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName ?? "",
            Email = user.Email ?? ""
        };
    }

    // 🔥 UPDATE CURRENT USER
    public async Task<ServiceResponse> UpdateCurrentUser(ClaimsPrincipal user, UpdateUserRequest model)
    {
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return new ServiceResponse
            {
                Success = false,
                Message = "Unauthorized"
            };

        var currentUser = await _userManager.FindByIdAsync(userId);

        if (currentUser == null)
            return new ServiceResponse
            {
                Success = false,
                Message = "User not found"
            };

        // 🔥 UPDATE FIELD (chỉ update nếu có data)
        if (!string.IsNullOrEmpty(model.UserName))
            currentUser.UserName = model.UserName;

        if (!string.IsNullOrEmpty(model.FullName))
            currentUser.FullName = model.FullName;

        if (!string.IsNullOrEmpty(model.Bio))
            currentUser.Bio = model.Bio;

        if (!string.IsNullOrEmpty(model.Avatar))
            currentUser.Avatar = model.Avatar;

        if (model.DateOfBirth.HasValue)
            currentUser.DateOfBirth = model.DateOfBirth.Value;

        var result = await _userManager.UpdateAsync(currentUser);

        if (!result.Succeeded)
            return new ServiceResponse
            {
                Success = false,
                Message = "Update failed"
            };

        return new ServiceResponse
        {
            Success = true,
            Message = "Cập nhật thành công"
        };
    }

    // 🔥 DELETE USER
    public async Task<ServiceResponse> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);

        if (user == null)
            return new ServiceResponse
            {
                Success = false,
                Message = "User not found"
            };

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return new ServiceResponse
            {
                Success = false,
                Message = "Delete failed"
            };

        return new ServiceResponse
        {
            Success = true,
            Message = "Xóa thành công"
        };
    }
}