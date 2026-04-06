public class UserResponse
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }

    public string? FullName { get; set; }
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public DateTime? DateOfBirth { get; set; }
}