using Microsoft.AspNetCore.Identity;
using backend.Models.Response;
using backend.Models.Request;

using backend.Interfaces;
using backend.Models.Entities;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtService _jwtService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
    }

    // 🔥 MAP USER (optional nhưng nên có)
    private object MapAuthData(ApplicationUser user, string token)
    {
        return new
        {
            token = token,
            email = user.Email,
            userName = user.UserName,
            userId = user.Id
        };
    }

    // ✅ LOGIN
    public async Task<AuthResponse> Login(LoginModel model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
        {
            return new AuthResponse
            {
                success = false,
                message = "Email không tồn tại"
            };
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                success = false,
                message = "Sai mật khẩu"
            };
        }

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            success = true,
            message = "Đăng nhập thành công",
            data = MapAuthData(user, token)
        };
    }

    // ✅ REGISTER
    public async Task<AuthResponse> Register(RegisterModel model)
    {
        var exist = await _userManager.FindByEmailAsync(model.Email);

        if (exist != null)
        {
            return new AuthResponse
            {
                success = false,
                message = "Email đã tồn tại"
            };
        }

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email
        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                success = false,
                errors = result.Errors.Select(e => e.Description)
            };
        }

        return new AuthResponse
        {
            success = true,
            message = "Đăng ký thành công"
        };
    }
}