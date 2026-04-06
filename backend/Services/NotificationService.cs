using Microsoft.EntityFrameworkCore;

public class NotificationService
{
    private readonly AppDbContext _context;

    public NotificationService(AppDbContext context)
    {
        _context = context;
    }

    // 🔥 CREATE
    public async Task Create(CreateNotificationRequest request)
    {
        var notification = new Notification
        {
            UserId = request.UserId,
            FromUserId = request.FromUserId,
            Content = request.Content,
            Type = request.Type
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
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

    // ✅ MARK AS READ
    public async Task<bool> MarkAsRead(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return false;

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return true;
    }

    // ✅ DELETE
    public async Task<bool> Delete(int id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return false;

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();

        return true;
    }
}