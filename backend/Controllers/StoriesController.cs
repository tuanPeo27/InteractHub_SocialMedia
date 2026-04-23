using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using backend.Interfaces;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StoriesController : ControllerBase
{
    private readonly IStoryService _storyService;

    public StoriesController(IStoryService storyService)
    {
        _storyService = storyService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    // POST: api/stories
    [HttpPost]
    public async Task<IActionResult> Create(StoryCreateRequest dto)
    {
        var userId = GetUserId();

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        try
        {
            await _storyService.CreateAsync(userId, dto);
            return Ok("Đã đăng story");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}