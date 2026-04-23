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
        var posts = await _service.GetAllAsync();
        return Ok(posts);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _service.GetByIdAsync(id);
        if (post == null) return NotFound();

        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePostRequest dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var post = await _service.CreateAsync(dto, userId);
        return Ok(post);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdatePostRequest dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        if (!success) return NotFound();

        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);
        if (!success) return NotFound();

        return Ok();
    }
}