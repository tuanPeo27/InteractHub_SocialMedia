using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

using backend.Interfaces;
using backend.DTOs.Request;
using backend.DTOs.Response;
namespace backend.Controllers;



[ApiController]
[Route("api/reports")]
public class ReportController : ControllerBase
{
    private readonly IReportService _service;

    public ReportController(IReportService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReport([FromBody] CreateReportRequest dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        try
        {
            var result = await _service.CreateReportAsync(userId, dto);

            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}