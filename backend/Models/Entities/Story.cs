namespace backend.Models.Entities;

using backend.Models.Enums;

public class Story
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiredAt { get; set; }
    public PostVisibility Visibility { get; set; } = PostVisibility.Public;

    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
}