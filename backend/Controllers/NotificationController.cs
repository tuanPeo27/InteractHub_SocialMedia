using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.Interfaces;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationController(INotificationService service)
    {
        _service = service;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var data = await _service.GetByUser(userId);
        return Ok(data);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateNotificationRequest request)
    {
        var fromUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrEmpty(fromUserId))
        {
            return Unauthorized();
        }

        request.FromUserId = fromUserId;

        var result = await _service.Create(request);
        return Ok(result);
    }

    [HttpPut("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var success = await _service.MarkAsRead(id, userId);

        if (!success) return NotFound();

        return Ok(new { message = "Đã đọc" });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var success = await _service.Delete(id, userId);

        if (!success) return NotFound();

        return Ok(new { message = "Đã xóa" });
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeleteAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var deletedCount = await _service.DeleteAll(userId);

        return Ok(new { message = "Đã xóa tất cả", deletedCount });
    }
}