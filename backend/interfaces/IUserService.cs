using System.Security.Claims;

public interface IUserService
{
    Task<UserResponse?> GetCurrentUser(ClaimsPrincipal user);
    IEnumerable<UserResponse> GetAll();
    Task<UserResponse?> GetById(string id);

    Task<ServiceResponse> UpdateCurrentUser(ClaimsPrincipal user, UpdateUserRequest model);
    Task<ServiceResponse> Delete(string id);
}