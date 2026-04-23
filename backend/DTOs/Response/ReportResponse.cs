namespace backend.DTOs.Response;

public class ReportResponse
{
    public int Id { get; set; }
    public int PostId { get; set; }
    public string Reason { get; set; }
    public string UserName { get; set; }

    public DateTime CreatedAt { get; set; }
}