namespace backend.Models.Entities;

using backend.Models.Enums;
public class Post
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    public ICollection<Comment> Comments { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<PostHashtag> PostHashtags { get; set; }
    public ICollection<PostReport> Reports { get; set; }

    public PostVisibility Visibility { get; set; }

}