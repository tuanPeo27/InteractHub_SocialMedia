using backend.DTOs.Request;
using backend.Interfaces;
using backend.Models.Entities;
using backend.Services;

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

using Moq;
using Xunit;

namespace backend.Tests;

public class AuthServiceTests
{
    private readonly Mock<UserManager<ApplicationUser>> _userManager;
    private readonly Mock<SignInManager<ApplicationUser>> _signInManager;
    private readonly Mock<RoleManager<IdentityRole>> _roleManager;

    private readonly Mock<IEmailService> _emailService;
    private readonly Mock<IConfiguration> _config;

    private readonly JwtService _jwtService;
    private readonly AuthService _service;

    public AuthServiceTests()
    {
        // ================= USER MANAGER =================

        var userStore = new Mock<IUserStore<ApplicationUser>>();

        _userManager = new Mock<UserManager<ApplicationUser>>(
            userStore.Object,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!
        );

        // ================= SIGN IN MANAGER =================

        var contextAccessor =
            new Mock<Microsoft.AspNetCore.Http.IHttpContextAccessor>();

        var claimsFactory =
            new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();

        _signInManager = new Mock<SignInManager<ApplicationUser>>(
            _userManager.Object,
            contextAccessor.Object,
            claimsFactory.Object,
            null!,
            null!,
            null!,
            null!
        );

        // ================= ROLE MANAGER =================

        var roleStore = new Mock<IRoleStore<IdentityRole>>();

        _roleManager = new Mock<RoleManager<IdentityRole>>(
            roleStore.Object,
            null!,
            null!,
            null!,
            null!
        );

        // ================= CONFIG =================

        _config = new Mock<IConfiguration>();

        var jwtSection = new Mock<IConfigurationSection>();

        jwtSection.Setup(x => x["Key"])
            .Returns("super-secret-jwt-key-123456789-super-secret");

        jwtSection.Setup(x => x["Issuer"])
            .Returns("test-issuer");

        jwtSection.Setup(x => x["Audience"])
            .Returns("test-audience");

        jwtSection.Setup(x => x["ExpireMinutes"])
            .Returns("60");

        _config.Setup(x => x.GetSection("Jwt"))
            .Returns(jwtSection.Object);

        _config.Setup(x => x["Frontend:BaseUrl"])
            .Returns("http://localhost:3000");

        _config.Setup(x => x["Frontend:ResetPasswordPath"])
            .Returns("/reset-password");

        // ================= EMAIL =================

        _emailService = new Mock<IEmailService>();

        // ================= JWT =================

        _jwtService = new JwtService(_config.Object);

        // ================= SERVICE =================

        _service = new AuthService(
            _userManager.Object,
            _signInManager.Object,
            _roleManager.Object,
            _jwtService,
            _emailService.Object,
            _config.Object
        );
    }

    // =====================================================
    // LOGIN TESTS
    // =====================================================

    [Fact]
    public async Task Login_Should_Return_Token_When_Valid()
    {
        var user = new ApplicationUser
        {
            Id = "1",
            Email = "admin@gmail.com",
            UserName = "admin"
        };

        _userManager.Setup(x =>
            x.FindByEmailAsync("admin@gmail.com"))
            .ReturnsAsync(user);

        _signInManager.Setup(x =>
            x.CheckPasswordSignInAsync(
                user,
                "123456",
                false))
            .ReturnsAsync(SignInResult.Success);

        _userManager.Setup(x =>
            x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "Admin" });

        var result = await _service.Login(new LoginModel
        {
            Email = "admin@gmail.com",
            Password = "123456"
        });

        Assert.True(result.success);
        Assert.NotNull(result.data);
    }

    [Fact]
    public async Task Login_Should_Return_Fail_When_User_NotFound()
    {
        _userManager.Setup(x =>
            x.FindByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _service.Login(new LoginModel
        {
            Email = "notfound@gmail.com",
            Password = "123456"
        });

        Assert.False(result.success);
        Assert.Equal("Email không tồn tại", result.message);
    }

    [Fact]
    public async Task Login_Should_Return_Fail_When_WrongPassword()
    {
        var user = new ApplicationUser
        {
            Id = "1",
            Email = "admin@gmail.com"
        };

        _userManager.Setup(x =>
            x.FindByEmailAsync(user.Email))
            .ReturnsAsync(user);

        _signInManager.Setup(x =>
            x.CheckPasswordSignInAsync(
                user,
                "wrongpassword",
                false))
            .ReturnsAsync(SignInResult.Failed);

        var result = await _service.Login(new LoginModel
        {
            Email = "admin@gmail.com",
            Password = "wrongpassword"
        });

        Assert.False(result.success);
        Assert.Equal("Sai mật khẩu", result.message);
    }

    [Fact]
    public async Task Login_Should_Return_Fail_When_User_Has_No_Role()
    {
        var user = new ApplicationUser
        {
            Id = "1",
            Email = "user@gmail.com"
        };

        _userManager.Setup(x =>
            x.FindByEmailAsync(user.Email))
            .ReturnsAsync(user);

        _signInManager.Setup(x =>
            x.CheckPasswordSignInAsync(
                user,
                "123456",
                false))
            .ReturnsAsync(SignInResult.Success);

        _userManager.Setup(x =>
            x.GetRolesAsync(user))
            .ReturnsAsync(new List<string>());

        var result = await _service.Login(new LoginModel
        {
            Email = "user@gmail.com",
            Password = "123456"
        });

        Assert.False(result.success);
        Assert.Equal("Tài khoản chưa được gán role", result.message);
    }

    // =====================================================
    // REGISTER TESTS
    // =====================================================

    [Fact]
    public async Task Register_Should_Success()
    {
        _userManager.Setup(x =>
            x.FindByEmailAsync("new@gmail.com"))
            .ReturnsAsync((ApplicationUser?)null);

        _userManager.Setup(x =>
            x.CreateAsync(
                It.IsAny<ApplicationUser>(),
                "123456"))
            .ReturnsAsync(IdentityResult.Success);

        _roleManager.Setup(x =>
            x.RoleExistsAsync("User"))
            .ReturnsAsync(true);

        _userManager.Setup(x =>
            x.AddToRoleAsync(
                It.IsAny<ApplicationUser>(),
                "User"))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _service.Register(new RegisterModel
        {
            Email = "new@gmail.com",
            Password = "123456"
        });

        Assert.True(result.success);
    }

    [Fact]
    public async Task Register_Should_Fail_When_Email_Exists()
    {
        _userManager.Setup(x =>
            x.FindByEmailAsync("exist@gmail.com"))
            .ReturnsAsync(new ApplicationUser());

        var result = await _service.Register(new RegisterModel
        {
            Email = "exist@gmail.com",
            Password = "123456"
        });

        Assert.False(result.success);
        Assert.Equal("Email đã tồn tại", result.message);
    }

    // =====================================================
    // CHANGE PASSWORD TESTS
    // =====================================================

    [Fact]
    public async Task ChangePassword_Should_Fail_When_User_NotFound()
    {
        _userManager.Setup(x =>
            x.FindByIdAsync("1"))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _service.ChangePassword(
            "1",
            new ChangePasswordRequest
            {
                CurrentPassword = "123",
                NewPassword = "456"
            });

        Assert.False(result.success);
    }

    [Fact]
    public async Task ChangePassword_Should_Success()
    {
        var user = new ApplicationUser
        {
            Id = "1"
        };

        _userManager.Setup(x =>
            x.FindByIdAsync("1"))
            .ReturnsAsync(user);

        _userManager.Setup(x =>
            x.ChangePasswordAsync(
                user,
                "123",
                "456"))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _service.ChangePassword(
            "1",
            new ChangePasswordRequest
            {
                CurrentPassword = "123",
                NewPassword = "456"
            });

        Assert.True(result.success);
    }

    // =====================================================
    // FORGOT PASSWORD TESTS
    // =====================================================

    [Fact]
    public async Task ForgotPassword_Should_Fail_When_Email_Empty()
    {
        var result = await _service.ForgotPassword(
            new ForgotPasswordRequest
            {
                Email = ""
            });

        Assert.False(result.success);
    }

    [Fact]
    public async Task ForgotPassword_Should_Return_Success_When_User_NotFound()
    {
        _userManager.Setup(x =>
            x.FindByEmailAsync("notfound@gmail.com"))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _service.ForgotPassword(
            new ForgotPasswordRequest
            {
                Email = "notfound@gmail.com"
            });

        Assert.True(result.success);
    }

    [Fact]
    public async Task ForgotPassword_Should_Send_Email()
    {
        var user = new ApplicationUser
        {
            Email = "admin@gmail.com"
        };

        _userManager.Setup(x =>
            x.FindByEmailAsync(user.Email))
            .ReturnsAsync(user);

        _userManager.Setup(x =>
            x.GeneratePasswordResetTokenAsync(user))
            .ReturnsAsync("reset-token");

        var result = await _service.ForgotPassword(
            new ForgotPasswordRequest
            {
                Email = "admin@gmail.com"
            });

        Assert.True(result.success);

        _emailService.Verify(x =>
            x.SendAsync(
                It.IsAny<string>(),
                It.IsAny<string>(),
                It.IsAny<string>()),
            Times.Once);
    }

    // =====================================================
    // RESET PASSWORD TESTS
    // =====================================================

    [Fact]
    public async Task ResetPassword_Should_Fail_When_Email_Empty()
    {
        var result = await _service.ResetPassword(
            new ResetPasswordRequest
            {
                Email = "",
                Token = ""
            });

        Assert.False(result.success);
    }

    [Fact]
    public async Task ResetPassword_Should_Fail_When_User_NotFound()
    {
        _userManager.Setup(x =>
            x.FindByEmailAsync("abc@gmail.com"))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _service.ResetPassword(
            new ResetPasswordRequest
            {
                Email = "abc@gmail.com",
                Token = "abc",
                NewPassword = "123456"
            });

        Assert.False(result.success);
    }
}