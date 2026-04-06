using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _service;

    public NotificationController(NotificationService service)
    {
        _service = service;
    }

    // 🔥 lấy userId từ JWT
    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    // ✅ GET: api/notification
    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userId = GetUserId();
        var data = await _service.GetByUser(userId);

        return Ok(data);
    }

    // ✅ POST (test hoặc internal)
    [HttpPost]
    public async Task<IActionResult> Create(CreateNotificationRequest request)
    {
        await _service.Create(request);
        return Ok(new { message = "Created" });
    }

    // ✅ PUT: mark as read
    [HttpPut("read/{id}")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var result = await _service.MarkAsRead(id);

        if (!result)
            return NotFound();

        return Ok(new { message = "Đã đọc" });
    }

    // ✅ DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.Delete(id);

        if (!result)
            return NotFound();

        return Ok(new { message = "Deleted" });
    }
}