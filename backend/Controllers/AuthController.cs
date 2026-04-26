using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Interfaces;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var result = await _authService.Login(model);

        if (!result.success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        var result = await _authService.Register(model);

        if (!result.success)
            return BadRequest(result);

        return Ok(result);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new AuthResponse
            {
                success = false,
                message = "Unauthorized"
            });
        }

        var result = await _authService.ChangePassword(userId, model);

        if (!result.success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
    {
        var result = await _authService.ForgotPassword(model);

        if (!result.success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
    {
        var result = await _authService.ResetPassword(model);

        if (!result.success)
            return BadRequest(result);

        return Ok(result);
    }
}