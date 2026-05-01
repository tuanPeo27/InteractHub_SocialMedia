using Microsoft.AspNetCore.Identity;
using System.Text;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.WebUtilities;
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
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        JwtService jwtService,
        IEmailService emailService,
        IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
        _jwtService = jwtService;
        _emailService = emailService;
        _config = config;
    }

    private static string EncodeToken(string token)
    {
        var tokenBytes = Encoding.UTF8.GetBytes(token);
        return WebEncoders.Base64UrlEncode(tokenBytes);
    }

    private static string DecodeToken(string encodedToken)
    {
        var tokenBytes = WebEncoders.Base64UrlDecode(encodedToken);
        return Encoding.UTF8.GetString(tokenBytes);
    }

    private string? TryBuildResetPasswordLink(string email, string encodedToken)
    {
        var baseUrl = _config["Frontend:BaseUrl"];
        if (string.IsNullOrWhiteSpace(baseUrl))
            return null;

        var path = _config["Frontend:ResetPasswordPath"];
        if (string.IsNullOrWhiteSpace(path))
            path = "/reset-password";

        var safeEmail = UrlEncoder.Default.Encode(email);
        var safeToken = UrlEncoder.Default.Encode(encodedToken);

        return $"{baseUrl.TrimEnd('/')}{path}?email={safeEmail}&token={safeToken}";
    }

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

        if (!string.IsNullOrWhiteSpace(model.UserName))
        {
            var usernameExist = await _userManager.FindByNameAsync(model.UserName);
            if (usernameExist != null)
            {
                return new AuthResponse
                {
                    success = false,
                    message = "Tên người dùng đã tồn tại"
                };
            }
        }

        var normalizedUserName = string.IsNullOrWhiteSpace(model.UserName) ? model.Email : model.UserName;

        var user = new ApplicationUser
        {
            UserName = normalizedUserName,
            Email = model.Email,
            FullName = string.IsNullOrWhiteSpace(model.FullName) ? null : model.FullName
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

    public async Task<AuthResponse> ChangePassword(string userId, ChangePasswordRequest model)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return new AuthResponse
            {
                success = false,
                message = "Unauthorized"
            };
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return new AuthResponse
            {
                success = false,
                message = "User không tồn tại"
            };
        }

        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                success = false,
                message = "Đổi mật khẩu thất bại",
                errors = result.Errors.Select(e => e.Description)
            };
        }

        return new AuthResponse
        {
            success = true,
            message = "Đổi mật khẩu thành công"
        };
    }

    public async Task<AuthResponse> ForgotPassword(ForgotPasswordRequest model)
    {
        if (string.IsNullOrWhiteSpace(model.Email))
        {
            return new AuthResponse
            {
                success = false,
                message = "Email không hợp lệ"
            };
        }

        var user = await _userManager.FindByEmailAsync(model.Email);

        // Always return success to prevent user enumeration
        var response = new AuthResponse
        {
            success = true,
            message = "Nếu email tồn tại, hệ thống đã gửi hướng dẫn đặt lại mật khẩu"
        };

        if (user == null || string.IsNullOrWhiteSpace(user.Email))
        {
            return response;
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = EncodeToken(token);
        var resetLink = TryBuildResetPasswordLink(user.Email, encodedToken);

        var subject = "Reset mật khẩu";
        var body = resetLink == null
            ? "Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng mở trang đặt lại mật khẩu và nhập token được cấp."
            : $"Bạn vừa yêu cầu đặt lại mật khẩu. Mở link sau để đặt lại: <a href=\"{resetLink}\">Reset password</a>";

        await _emailService.SendAsync(user.Email, subject, body);

        return response;
    }

    public async Task<AuthResponse> ResetPassword(ResetPasswordRequest model)
    {
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Token))
        {
            return new AuthResponse
            {
                success = false,
                message = "Email hoặc token không hợp lệ"
            };
        }

        var user = await _userManager.FindByEmailAsync(model.Email);

        if (user == null)
        {
            return new AuthResponse
            {
                success = false,
                message = "Token không hợp lệ"
            };
        }

        string decodedToken;
        try
        {
            decodedToken = DecodeToken(model.Token);
        }
        catch
        {
            return new AuthResponse
            {
                success = false,
                message = "Token không hợp lệ"
            };
        }

        var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);

        if (!result.Succeeded)
        {
            return new AuthResponse
            {
                success = false,
                message = "Reset mật khẩu thất bại",
                errors = result.Errors.Select(e => e.Description)
            };
        }

        return new AuthResponse
        {
            success = true,
            message = "Reset mật khẩu thành công"
        };
    }
}