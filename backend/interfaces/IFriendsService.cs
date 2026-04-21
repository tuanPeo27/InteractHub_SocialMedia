
namespace backend.Interfaces;

using backend.Models.Entities;
public interface IFriendsService
{
    Task SendRequest(string senderId, string receiverId);
    Task AcceptRequest(int requestId, string userId);
    Task RejectRequest(int requestId, string userId);
    Task<List<FriendShip>> GetFriends(string userId);
}