using System.ComponentModel.DataAnnotations;
public class CreatePostDTO
{
    [Required]
    [MaxLength(500)]
    public string Content { get; set; }

    public string? ImageUrl { get; set; }
}