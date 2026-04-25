namespace backend.DTOs.Response;

public class LikeResponse
{
    public int PostId { get; set; }
    public int TotalLikes { get; set; }
    public bool IsLiked { get; set; }
}