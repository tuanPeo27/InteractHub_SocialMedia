public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    public string? FullName { get; set; }
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public DateTime? DateOfBirth { get; set; }
}