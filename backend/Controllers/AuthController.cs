using Microsoft.AspNetCore.Mvc;
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
}