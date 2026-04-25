using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LikeController : ControllerBase
{
    private readonly ILikeService _service;

    public LikeController(ILikeService service)
    {
        _service = service;
    }

    [HttpPost("{postId}")]
    public async Task<IActionResult> ToggleLike(int postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        try
        {
            var liked = await _service.ToggleLike(postId, userId);
            return Ok(new
            {
                isLiked = liked
            });
        }


        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpGet("{postId}")]
    public async Task<IActionResult> GetLikeInfo(int postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        try
        {
            var result = await _service.GetLikeInfo(postId, userId);

            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}