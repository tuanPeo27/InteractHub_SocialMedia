public class Notification
{
    public int Id { get; set; }

    public string Content { get; set; }
    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // người nhận
    public string UserId { get; set; }
    public ApplicationUser User { get; set; }

    // người gửi
    public string? FromUserId { get; set; }
    public ApplicationUser? FromUser { get; set; }

    public string? Type { get; set; } // like, comment, follow
}