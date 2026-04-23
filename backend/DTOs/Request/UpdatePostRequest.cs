using System.ComponentModel.DataAnnotations;
namespace backend.DTOs.Request;

public class UpdatePostRequest

{
    [MaxLength(500)]
    public string Content { get; set; }

    public string? ImageUrl { get; set; }
}