namespace backend.DTOs.Response;

public class LikeUserResponse
{
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string? Avatar { get; set; }
    public DateTime LikedAt { get; set; }
}