using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

using backend.Interfaces;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostsController : ControllerBase
{
    private readonly IPostsService _service;

    public PostsController(IPostsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var posts = await _service.GetFeed(userId);
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var post = await _service.GetById(id, userId);
            if (post == null) return NotFound();

            return Ok(post);
        }
        catch
        {
            return Forbid();
        }
    }

    [HttpGet("my-posts")]
    public async Task<IActionResult> GetMyPosts()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var posts = await _service.GetMyPosts(userId);
        return Ok(posts);
    }
    [HttpPost]
    public async Task<IActionResult> Create(CreatePostRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var post = await _service.CreateAsync(dto, userId);
        return Ok(post);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdatePostRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var success = await _service.UpdateAsync(id, userId, dto);

            if (!success) return NotFound();

            return Ok("Updated successfully");
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid(); // 403
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
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