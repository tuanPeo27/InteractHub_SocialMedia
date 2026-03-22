public class Story
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime ExpiredAt { get; set; }

    public string UserId { get; set; }
    public ApplicationUser User { get; set; }
}