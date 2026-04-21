using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace backend.Controllers;

[ApiController]
[Route("api/friends")]
public class FriendsController : ControllerBase
{
    private readonly IFriendsService _service;

    public FriendsController(IFriendsService service)
    {
        _service = service;
    }

    private string GetUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    [Authorize]
    [HttpPost("request")]
    public async Task<IActionResult> SendRequest(FriendRequestDto dto)
    {
        await _service.SendRequest(GetUserId(), dto.ReceiverId);
        return Ok("Đã gửi lời mời");
    }

    [Authorize]
    [HttpPost("accept/{id}")]
    public async Task<IActionResult> Accept(int id)
    {
        await _service.AcceptRequest(id, GetUserId());
        return Ok("Đã chấp nhận");
    }

    [Authorize]
    [HttpPost("reject/{id}")]
    public async Task<IActionResult> Reject(int id)
    {
        await _service.RejectRequest(id, GetUserId());
        return Ok("Đã từ chối");
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetFriends()
    {
        var data = await _service.GetFriends(GetUserId());
        return Ok(data);
    }
}