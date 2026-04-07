public interface INotificationService
{
    Task<NotificationResponse> Create(CreateNotificationRequest request);

    Task<List<NotificationResponse>> GetByUser(string userId);

    Task<bool> MarkAsRead(int id, string userId);

    Task<bool> Delete(int id, string userId);
}