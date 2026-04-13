using backend.Models.Response;
using backend.Models.Request;
namespace backend.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> Login(LoginModel model);

    Task<AuthResponse> Register(RegisterModel model);
}