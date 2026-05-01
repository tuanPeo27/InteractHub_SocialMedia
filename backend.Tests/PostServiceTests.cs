using backend.Services;
using backend.Models.Entities;
using backend.DTOs.Request;
using backend.Interfaces;
using backend.Models.Enums;

using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Tests;

public class PostServiceTests
{
    private readonly AppDbContext _context;
    private readonly Mock<IPrivacyService> _privacy;
    private readonly Mock<IHashtagService> _hashtag;
    private readonly PostsService _service;

    public PostServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // FIX: isolate DB
            .Options;

        _context = new AppDbContext(options);

        _privacy = new Mock<IPrivacyService>();
        _hashtag = new Mock<IHashtagService>();

        _service = new PostsService(_context, _privacy.Object, _hashtag.Object);
    }

    // ================= GET FEED =================

    [Fact]
    public async Task GetFeed_ReturnPosts()
    {
        _context.Posts.Add(new Post
        {
            Id = 1,
            UserId = "u1",
            Content = "hello", // FIX REQUIRED FIELD
            CreatedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        _privacy.Setup(x => x.CanViewPost(It.IsAny<Post>(), "u1"))
            .ReturnsAsync(true);

        var result = await _service.GetFeed("u1");

        Assert.Single(result);
    }

    // ================= GET BY ID =================

    [Fact]
    public async Task GetById_NotFound()
    {
        var result = await _service.GetById(99, "u1");

        Assert.Null(result);
    }

    // ================= CREATE =================

    [Fact]
    public async Task Create_PostSuccess()
    {
        _hashtag.Setup(x =>
            x.AddHashtagsToPost(It.IsAny<int>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        var result = await _service.CreateAsync(
            new CreatePostRequest
            {
                Content = "hello world",
                Visibility = PostVisibility.Public
            },
            "u1"
        );

        Assert.NotNull(result);
        Assert.Equal("hello world", result.Content);
    }

    // ================= DELETE =================

    [Fact]
    public async Task Delete_NotFound()
    {
        var result = await _service.DeleteAsync(99, "u1");

        Assert.False(result);
    }
    
}