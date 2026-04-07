using Microsoft.EntityFrameworkCore;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    // 🔥 MAP FUNCTION
    private NotificationResponse Map(Notification n)
    {
        return new NotificationResponse
        {
            Id = n.Id,
            Content = n.Content,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt,
            FromUserId = n.FromUserId,
            FromUserName = n.FromUser != null ? n.FromUser.UserName : null,
            Type = n.Type
        };
    }

    // 🔥 CREATE
    public async Task<NotificationResponse> Create(CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            UserId = request.UserId,
            FromUserId = request.FromUserId,
            Content = request.Content,
            Type = request.Type,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // load FromUser nếu cần
        await _context.Entry(notification).Reference(n => n.FromUser).LoadAsync();

        return Map(notification);
    }

    // ✅ GET ALL theo user
    public async Task<List<NotificationResponse>> GetByUser(string userId)
    {
        return await _context.Notifications
            .Include(n => n.FromUser)
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NotificationResponse
            {
                Id = n.Id,
                Content = n.Content,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt,
                FromUserId = n.FromUserId,
                FromUserName = n.FromUser != null ? n.FromUser.UserName : null,
                Type = n.Type
            })
            .ToListAsync();
    }

    // 🔐 MARK AS READ (fix bảo mật)
    public async Task<bool> MarkAsRead(int id, string userId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (notification == null) return false;

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return true;
    }

    // 🔐 DELETE (fix bảo mật)
    public async Task<bool> Delete(int id, string userId)
    {
        var notification = await _context.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

        if (notification == null) return false;

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();

        return true;
    }
}