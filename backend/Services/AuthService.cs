using Microsoft.AspNetCore.Identity;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Interfaces;
using backend.Models.Entities;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly JwtService _jwtService;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        JwtService jwtService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
    }

    // 🔥 MAP USER (optional nhưng nên có)
    private object MapAuthData(ApplicationUser user, string token, IList<string> roles)
    {
        return new
        {
            token = token,
            email = user.Email,
            userName = user.UserName,
            userId = user.Id,
            roles = roles,
            primaryRole = roles.FirstOrDefault()
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

        var roles = await _userManager.GetRolesAsync(user);

        if (roles.Count == 0)
        {
            return new AuthResponse
            {
                success = false,
                message = "Tài khoản chưa được gán role"
            };
        }

        var token = _jwtService.GenerateToken(user, roles);

        return new AuthResponse
        {
            success = true,
            message = "Đăng nhập thành công",
            data = MapAuthData(user, token, roles)
        };
    }

    // ✅ REGISTER
    public async Task<AuthResponse> Register(RegisterModel model)
    {
        const string defaultRole = "User";

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

        if (!await _roleManager.RoleExistsAsync(defaultRole))
        {
            var createRoleResult = await _roleManager.CreateAsync(new IdentityRole(defaultRole));

            if (!createRoleResult.Succeeded)
            {
                return new AuthResponse
                {
                    success = false,
                    message = "Tạo role mặc định thất bại",
                    errors = createRoleResult.Errors.Select(e => e.Description)
                };
            }
        }

        var addRoleResult = await _userManager.AddToRoleAsync(user, defaultRole);

        if (!addRoleResult.Succeeded)
        {
            return new AuthResponse
            {
                success = false,
                message = "Gán role cho user thất bại",
                errors = addRoleResult.Errors.Select(e => e.Description)
            };
        }

        return new AuthResponse
        {
            success = true,
            message = "Đăng ký thành công"
        };
    }
}