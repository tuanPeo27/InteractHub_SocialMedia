namespace backend.DTOs.Request;

public class CreateNotificationRequest
{
    public string? UserId { get; set; }          // người nhận
    public string? FromUserId { get; set; }     // người gửi
    public string? Content { get; set; }
    public string? Type { get; set; }           // like, comment, follow
}