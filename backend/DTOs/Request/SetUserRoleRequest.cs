namespace backend.DTOs.Request;

public class SetUserRoleRequest
{
    public string UserId { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
}