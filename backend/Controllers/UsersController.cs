using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using backend.Interfaces;
namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    // GET CURRENT USER
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var user = await _userService.GetCurrentUser(User);

        if (user == null)
            return Unauthorized();

        return Ok(user);
    }

    // GET ALL USERS
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_userService.GetAll());
    }

    // GET USER BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userService.GetById(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // UPDATE CURRENT USER
    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateUserRequest model)
    {
        var result = await _userService.UpdateCurrentUser(User, model);

        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(new { message = result.Message });
    }

    // DELETE USER (ADMIN)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _userService.Delete(id);

        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(new { message = result.Message });
    }
}