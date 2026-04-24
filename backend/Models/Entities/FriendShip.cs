namespace backend.Models.Entities;

using backend.Models.Enums;

public class FriendShip
{
    public int Id { get; set; }

    public string SenderId { get; set; }
    public ApplicationUser Sender { get; set; }

    public string ReceiverId { get; set; }
    public ApplicationUser Receiver { get; set; }

    public FriendStatus Status { get; set; }
}