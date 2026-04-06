using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    // ✅ GET CURRENT USER
    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var user = await _userService.GetCurrentUser(User);

        if (user == null)
            return Unauthorized();

        return Ok(user);
    }

    // ✅ GET ALL USERS
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_userService.GetAll());
    }

    // ✅ GET USER BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userService.GetById(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // ✅ UPDATE USER
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(string id, UpdateUserRequest model)
    {
        var result = await _userService.Update(id, model);
        return Ok(result);
    }

    // ✅ DELETE USER
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _userService.Delete(id);
        return Ok(result);
    }
}