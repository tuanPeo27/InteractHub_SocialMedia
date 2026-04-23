namespace backend.DTOs.Request;

public class StoryCreateRequest
{
    public string Content { get; set; }
    public string ImageUrl { get; set; }
    public DateTime ExpiresAt { get; set; }
}