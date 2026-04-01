using System.ComponentModel.DataAnnotations;
public class UpdatePostDTO
{
    [MaxLength(500)]
    public string Content { get; set; }

    public string? ImageUrl { get; set; }
}