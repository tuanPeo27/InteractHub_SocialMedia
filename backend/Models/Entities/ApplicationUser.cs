using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string? Avatar { get; set; }
    public string? Bio { get; set; }

    public ICollection<Post> Posts { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<Story> Stories { get; set; }
    public ICollection<Notification> Notifications { get; set; }
}