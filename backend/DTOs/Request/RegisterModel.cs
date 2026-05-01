namespace backend.DTOs.Request
{
    public class RegisterModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? UserName { get; set; }
        public string? FullName { get; set; }
    }
}