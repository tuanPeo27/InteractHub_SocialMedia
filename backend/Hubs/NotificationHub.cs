using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using backend.DTOs.Response;

namespace backend.Hubs;

public interface INotificationClient
{
    Task NotificationCreated(NotificationResponse notification);
    Task NotificationRead(int notificationId);
    Task NotificationDeleted(int notificationId);
}

[Authorize]
public class NotificationHub : Hub<INotificationClient>
{
    public override async Task OnConnectedAsync()
    {
        if (string.IsNullOrEmpty(Context.UserIdentifier))
        {
            Context.Abort();
            return;
        }

        await base.OnConnectedAsync();
    }
}
