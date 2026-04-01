public class PostDTO
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string? ImageUrl { get; set; }
    public string UserId { get; set; }
    public DateTime CreatedAt { get; set; }
}