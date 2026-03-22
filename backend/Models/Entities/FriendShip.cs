public class Friendship
{
    public int Id { get; set; }

    public string SenderId { get; set; }
    public ApplicationUser Sender { get; set; }

    public string ReceiverId { get; set; }
    public ApplicationUser Receiver { get; set; }

    public string Status { get; set; } // Pending, Accepted
}