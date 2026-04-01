using Microsoft.EntityFrameworkCore;
public interface IPostsService
{
    Task<List<PostDTO>> GetAllAsync();
    Task<PostDTO?> GetByIdAsync(int id);
    Task<PostDTO> CreateAsync(CreatePostDTO dto, string userId);
    Task<bool> UpdateAsync(int id, UpdatePostDTO dto);
    Task<bool> DeleteAsync(int id);
}

// Services/PostService.cs
public class PostsService : IPostsService
{
    private readonly AppDbContext _context;

    public PostsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PostDTO>> GetAllAsync()
    {
        return await _context.Posts
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PostDTO
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                UserId = p.UserId,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<PostDTO?> GetByIdAsync(int id)
    {
        return await _context.Posts
            .Where(p => p.Id == id)
            .Select(p => new PostDTO
            {
                Id = p.Id,
                Content = p.Content,
                ImageUrl = p.ImageUrl,
                UserId = p.UserId,
                CreatedAt = p.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<PostDTO> CreateAsync(CreatePostDTO dto, string userId)
    {
        var post = new Post
        {
            Content = dto.Content,
            ImageUrl = dto.ImageUrl,
            UserId = userId
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        return new PostDTO
        {
            Id = post.Id,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            UserId = post.UserId,
            CreatedAt = post.CreatedAt
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdatePostDTO dto)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return false;

        post.Content = dto.Content ?? post.Content;
        post.ImageUrl = dto.ImageUrl ?? post.ImageUrl;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var post = await _context.Posts.FindAsync(id);
        if (post == null) return false;

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return true;
    }
}