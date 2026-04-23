namespace backend.DTOs.Response;

public class NotificationResponse
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? FromUserId { get; set; }
    public string? FromUserName { get; set; }

    public string? Type { get; set; }
}