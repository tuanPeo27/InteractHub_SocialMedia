using backend.Models.Response;
using backend.Models.Request;
public interface IAuthService
{
    Task<AuthResponse> Login(LoginModel model);

    Task<AuthResponse> Register(RegisterModel model);
}