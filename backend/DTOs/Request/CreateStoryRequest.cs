namespace backend.DTOs.Request;

using backend.Models.Enums;
public class CreateStoryRequest
{
    public string ImageUrl { get; set; }
    public PostVisibility Visibility { get; set; }

}