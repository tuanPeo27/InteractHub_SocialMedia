using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs.Request;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _service;

    public AdminController(IAdminService service)
    {
        _service = service;
    }

    [HttpGet("reports")]
    public async Task<IActionResult> GetReports()
    {
        var data = await _service.GetReportsAsync();
        return Ok(data);
    }

    [HttpDelete("posts/{postId}")]
    public async Task<IActionResult> DeletePost(int postId)
    {
        var ok = await _service.DeletePostAsync(postId);
        if (!ok) return NotFound("Post not found");

        return Ok("Deleted");
    }

    [HttpPost("ban-user/{userId}")]
    public async Task<IActionResult> BanUser(string userId)
    {
        var ok = await _service.BanUserAsync(userId);
        if (!ok) return NotFound("User not found");

        return Ok("User banned");
    }

    [HttpPost("unban-user/{userId}")]
    public async Task<IActionResult> UnbanUser(string userId)
    {
        var ok = await _service.UnbanUserAsync(userId);
        if (!ok) return NotFound("User not found");

        return Ok("User unbanned");
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var data = await _service.GetUsersAsync();
        return Ok(data);
    }

    [HttpPost("set-role")]
    public async Task<IActionResult> SetRole([FromBody] SetUserRoleRequest request)
    {
        var ok = await _service.SetUserRoleAsync(request.UserId, request.RoleName);
        if (!ok) return BadRequest("Update role failed");

        return Ok("Role updated");
    }
}