using backend.DTOs.Response;
using backend.DTOs.Request;
namespace backend.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> Login(LoginModel model);

    Task<AuthResponse> Register(RegisterModel model);
}