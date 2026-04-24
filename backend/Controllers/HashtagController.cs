using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Interfaces;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class HashtagController : ControllerBase
{
    private readonly IHashtagService _service;

    public HashtagController(IHashtagService service)
    {
        _service = service;
    }

    [HttpGet("{tag}")]
    public async Task<IActionResult> GetPostsByTag(string tag)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var result = await _service.GetPostsByHashtag(tag, userId);


            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}