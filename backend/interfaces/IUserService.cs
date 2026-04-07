using System.Security.Claims;

public interface IUserService
{
    Task<UserResponse?> GetCurrentUser(ClaimsPrincipal principal);

    List<UserResponse> GetAll();

    Task<UserResponse?> GetById(string id);

    Task<UserResponse?> Update(string id, UpdateUserRequest model);

    Task<bool> Delete(string id);
}