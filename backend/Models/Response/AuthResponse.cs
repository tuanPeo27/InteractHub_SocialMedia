namespace backend.Models.Response
{
    public class AuthResponse
    {
        public bool success { get; set; }
        public string message { get; set; }
        public object data { get; set; }
        public object errors { get; set; }
    }
}