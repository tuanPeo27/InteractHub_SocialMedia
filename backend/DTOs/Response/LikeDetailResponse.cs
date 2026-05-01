namespace backend.DTOs.Response;

public class LikeDetailResponse
{
    public int PostId { get; set; }
    public int TotalLikes { get; set; }
    public bool IsLikedByCurrentUser { get; set; }
    public List<LikeUserResponse> Users { get; set; }
}