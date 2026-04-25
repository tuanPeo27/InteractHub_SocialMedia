using System.ComponentModel.DataAnnotations;
using backend.Models.Enums;
namespace backend.DTOs.Request;

public class CreatePostRequest
{
    [Required]
    [MaxLength(500)]
    public string Content { get; set; }

    public string? ImageUrl { get; set; }
    public PostVisibility Visibility { get; set; }

}