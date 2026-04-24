
using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Enums;
namespace backend.Services;


public class FriendsService : IFriendsService
{
    private readonly AppDbContext _context;

    public FriendsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task SendRequest(string senderId, string receiverId)
    {
        var exist = await _context.FriendShips
            .FirstOrDefaultAsync(x =>
                x.SenderId == senderId && x.ReceiverId == receiverId);

        if (exist != null) throw new Exception("Đã gửi lời mời");

        var request = new FriendShip
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Status = FriendStatus.Pending,
        };

        _context.FriendShips.Add(request);
        await _context.SaveChangesAsync();
    }

    public async Task AcceptRequest(int requestId, string userId)
    {
        var request = await _context.FriendShips.FindAsync(requestId);

        if (request == null || request.ReceiverId != userId)
            throw new Exception("Không hợp lệ");

        request.Status = FriendStatus.Accepted;
        await _context.SaveChangesAsync();
    }

    public async Task RejectRequest(int requestId, string userId)
    {
        var request = await _context.FriendShips.FindAsync(requestId);

        if (request == null || request.ReceiverId != userId)
            throw new Exception("Không hợp lệ");

        request.Status = FriendStatus.Rejected;
        await _context.SaveChangesAsync();
    }

    public async Task<List<FriendShip>> GetFriends(string userId)
    {
        return await _context.FriendShips
            .Where(x =>
                (x.SenderId == userId || x.ReceiverId == userId)
                && x.Status == FriendStatus.Accepted)
            .ToListAsync();
    }

    public async Task<List<string>> GetFriendIds(string userId)
    {
        return await _context.FriendShips
            .Where(f =>
                (f.SenderId == userId || f.ReceiverId == userId)
                && f.Status == FriendStatus.Accepted)
            .Select(f => f.SenderId == userId ? f.ReceiverId : f.SenderId)
            .ToListAsync();
    }

    public async Task<bool> IsFriend(string user1, string user2)
    {
        return await _context.FriendShips
            .AnyAsync(f =>
                ((f.SenderId == user1 && f.ReceiverId == user2) ||
                 (f.SenderId == user2 && f.ReceiverId == user1))
                && f.Status == FriendStatus.Accepted);
    }
}