using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
        var userId = User.FindFirst("sub")?.Value; // hoặc ClaimTypes.NameIdentifier

        var data = await _service.GetByUser(userId);
        return Ok(data);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateNotificationRequest request)
    {
        var result = await _service.Create(request);
        return Ok(result);
    }

    [HttpPut("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = User.FindFirst("sub")?.Value;

        var success = await _service.MarkAsRead(id, userId);

        if (!success) return NotFound();

        return Ok(new { message = "Đã đọc" });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirst("sub")?.Value;

        var success = await _service.Delete(id, userId);

        if (!success) return NotFound();

        return Ok(new { message = "Đã xóa" });
    }
}