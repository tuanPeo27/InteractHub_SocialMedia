
namespace backend.Interfaces;

using backend.DTOs.Request;
using backend.DTOs.Response;
using backend.Models.Entities;
public interface IFriendsService
{
    Task SendRequest(string senderId, string receiverId);
    Task AcceptRequest(int requestId, string userId);
    Task RejectRequest(int requestId, string userId);
    Task<List<FriendShip>> GetFriends(string userId);

    Task<List<string>> GetFriendIds(string userId);
    Task<bool> IsFriend(string user1, string user2);
}