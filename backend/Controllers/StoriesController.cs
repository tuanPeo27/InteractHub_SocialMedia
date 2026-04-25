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
    private readonly IStoryService _service;

    public StoriesController(IStoryService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateStoryRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var story = await _service.CreateAsync(userId, dto);
        return Ok(story);
    }

    [HttpGet("my-stories")]
    public async Task<IActionResult> GetMyStories()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var stories = await _service.GetMyStories(userId);
        return Ok(stories);
    }

    [HttpGet("feed")]
    public async Task<IActionResult> GetFeed()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var stories = await _service.GetFeed(userId);
        return Ok(stories);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var success = await _service.DeleteAsync(id, userId);

            if (!success) return NotFound();

            return Ok("Deleted successfully");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
