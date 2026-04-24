namespace backend.DTOs.Response;

public class CommentResponse
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string UserId { get; set; }
    public int PostId { get; set; }
    public DateTime CreatedAt { get; set; }
}