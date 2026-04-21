
using Microsoft.EntityFrameworkCore;

using backend.Interfaces;
using backend.Models.Entities;

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
            Status = "Pending"
        };

        _context.FriendShips.Add(request);
        await _context.SaveChangesAsync();
    }

    public async Task AcceptRequest(int requestId, string userId)
    {
        var request = await _context.FriendShips.FindAsync(requestId);

        if (request == null || request.ReceiverId != userId)
            throw new Exception("Không hợp lệ");

        request.Status = "Accepted";
        await _context.SaveChangesAsync();
    }

    public async Task RejectRequest(int requestId, string userId)
    {
        var request = await _context.FriendShips.FindAsync(requestId);

        if (request == null || request.ReceiverId != userId)
            throw new Exception("Không hợp lệ");

        request.Status = "Rejected";
        await _context.SaveChangesAsync();
    }

    public async Task<List<FriendShip>> GetFriends(string userId)
    {
        return await _context.FriendShips
            .Where(x =>
                (x.SenderId == userId || x.ReceiverId == userId)
                && x.Status == "Accepted")
            .ToListAsync();
    }
}