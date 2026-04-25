using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

/// <summary>
/// Uses the authenticated user's id as SignalR UserIdentifier so Clients.User(userId) works.
/// Prefers <see cref="ClaimTypes.NameIdentifier"/> (default ASP.NET mapping) and falls back to JWT "sub".
/// </summary>
public sealed class SubClaimUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
        => connection.User?.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? connection.User?.FindFirstValue("sub");
}
